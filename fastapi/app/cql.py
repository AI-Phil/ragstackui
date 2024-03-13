from cassandra.cluster import Cluster
import re
import json
import os
import requests
from tempfile import gettempdir
import time
from urllib.parse import urlparse

def parse_connection_args_json(conn_args_str):
    """
    Parses a connection arguments string in JSON format into a Python dictionary.

    Args:
        conn_args_str (str): Connection arguments as a JSON-formatted string.

    Returns:
        dict: Connection arguments as a dictionary.
    """
    try:
        conn_args_dict = json.loads(conn_args_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Error parsing connection arguments: {str(e)}")

    return conn_args_dict

class CassandraConnectionsManager:
    def __init__(self):
        self.connections = {}
        # Setup DSE connection if DSE_CONNECTION env var is set
        dse_conn_str = os.getenv("DSE_CONNECTION")
        if dse_conn_str:
            try:
                self.connections['dse'] = CassandraConnector(**parse_connection_args_json(dse_conn_str))
            except:
                print(f"Failed to setup DSE connection with DSE_CONNECTION environment variable")

        # Setup Astra connection if Astra env vars are set
        astra_endpoint = os.getenv("ASTRA_DB_API_ENDPOINT")
        astra_token = os.getenv("ASTRA_DB_APPLICATION_TOKEN")
        if astra_endpoint and astra_token:
            try:
                self.connections['astra'] = CassandraConnector(astra={'endpoint': astra_endpoint, 'token': astra_token})
            except:
                print(f"Failed to setup Astra connection with endpoint: {astra_endpoint}")

    def get_connector(self, db_key):
        if db_key not in self.connections:
            raise ValueError(f"Connection for '{db_key}' not configured.")
        return self.connections[db_key]

class CassandraConnector:
    def __init__(self, **connectionArgs):
        self.connectionArgs = connectionArgs
        if self.connectionArgs.get('astra'):
            self.connectionType = 'astra'
            self._setup_astra_connection()
        else:
            self.connectionType = 'cassandra'
            self._setup_cassandra_connection()

    def _setup_cassandra_connection(self):
        # Extract and dynamically load the authentication provider class
        auth_provider_class = self.connectionArgs.pop('authProviderClass', None)
        auth_provider_args = self.connectionArgs.pop('authProviderArgs', {})

        if auth_provider_class:
            # Dynamically import the auth provider class
            module_path, class_name = auth_provider_class.rsplit('.', 1)
            module = __import__(module_path, fromlist=[class_name])
            auth_provider_class = getattr(module, class_name)
            auth_provider = auth_provider_class(**auth_provider_args)
        else:
            auth_provider = None

        # Pass the remaining connectionArgs and the auth_provider to the Cluster constructor
        self.cluster = Cluster(auth_provider=auth_provider, **self.connectionArgs)
        self.session = self.cluster.connect()

    def _setup_astra_connection(self):
        astra_args = self.connectionArgs['astra']
        scb_path = self._get_or_download_secure_connect_bundle(astra_args)        
        self.connectionArgs = {
            "cloud": {'secure_connect_bundle': scb_path}, 
            "authProviderClass": "cassandra.auth.PlainTextAuthProvider",
            "authProviderArgs": {"username": "token", "password": astra_args['token']},
        }
        self._setup_cassandra_connection() 
    
    def _get_or_download_secure_connect_bundle(self, astra_args):
        # Ensure datacenterID and regionName are extracted from endpoint if provided
        if 'endpoint' in astra_args and astra_args['endpoint']:
            # Parse the endpoint URL
            endpoint_parsed = urlparse(astra_args['endpoint'])
            # Extract the hostname without the domain suffix
            hostname_without_suffix = endpoint_parsed.netloc.split('.apps.astra.datastax.com')[0]
            # Split the hostname to get parts
            parts = hostname_without_suffix.split('-')
            # Datacenter is first 5 parts, everything after is region
            datacenterID = '-'.join(parts[:5])
            regionName = '-'.join(parts[5:])

            # Update astra_args with extracted values if not explicitly provided
            astra_args['datacenterID'] = astra_args.get('datacenterID') or datacenterID
            astra_args['regionName'] = astra_args.get('regionName') or regionName
        elif 'datacenterID' not in astra_args:
            raise ValueError("Astra endpoint or datacenterID must be provided in args.")

        scb_dir = os.path.join(gettempdir(), "cassandra-astra")
        os.makedirs(scb_dir, exist_ok=True)

        # Generate the secure connect bundle filename
        scb_filename = f"astra-secure-connect-{astra_args['datacenterID']}"
        if 'regionName' in astra_args:
            scb_filename += f"-{astra_args['regionName']}"
        scb_filename += ".zip"
        scb_path = os.path.join(scb_dir, scb_filename)

        if not os.path.exists(scb_path) or time.time() - os.path.getmtime(scb_path) > 360 * 24 * 60 * 60:
            download_url = self._get_secure_connect_bundle_url(astra_args)
            response = requests.get(download_url)
            response.raise_for_status()

            with open(scb_path, 'wb') as f:
                f.write(response.content)
        
        return scb_path

    def _get_secure_connect_bundle_url(self, astra_args):
        url_template = astra_args.get(
            'bundleUrlTemplate',
            "https://api.astra.datastax.com/v2/databases/{database_id}/secureBundleURL?all=true"
        )
        url = url_template.replace("{database_id}", astra_args['datacenterID'])

        headers = {
            'Authorization': f"Bearer {astra_args['token']}",
            'Content-Type': 'application/json',
        }
        response = requests.post(url, headers=headers)
        response.raise_for_status()

        data = response.json()
        if not data or len(data) == 0:
            raise ValueError("Failed to get secure bundle URLs.")

        # Assuming the first URL is the correct one; modify as needed.
        download_url = data[0]['downloadURL']
        return download_url

    def run_cql_query(self, query):
        """
        Executes a CQL query and returns the results in JSON format.
        """

        # Basic sanity checks
        query_trimmed = query.strip()
        if not query_trimmed.lower().startswith("select"):
            raise Exception("Query must start with SELECT.")

        # Allow a trailing semicolon
        query_trimmed = query_trimmed.rstrip(';')
        
        # Check for semicolons not encapsulated within quotes
        query_sanitized = re.sub(r"'.*?'", '', query_trimmed)    # Remove single-quoted strings
        query_sanitized = re.sub(r'".*?"', '', query_sanitized)  # Remove double-quoted strings
        
        if ";" in query_sanitized:
            raise Exception("Query contains invalid characters or sequence.")

        try:
            rows = self.session.execute(query_trimmed)
            result_json = [{column: getattr(row, column) for column in row._fields} for row in rows]
            return result_json
        except Exception as e:
            print(e)
            raise
