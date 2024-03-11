from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import re

CASSANDRA_CONTACT_POINTS = ['dse']
CASSANDRA_PORT = 9042
CASSANDRA_USERNAME = 'cassandra'
CASSANDRA_PASSWORD = 'cassandra'

class CassandraConnector:
    def __init__(self):
        # Setting up authentication and connection to the cluster
        auth_provider = PlainTextAuthProvider(username=CASSANDRA_USERNAME, password=CASSANDRA_PASSWORD)
        self.cluster = Cluster(contact_points=CASSANDRA_CONTACT_POINTS, port=CASSANDRA_PORT, auth_provider=auth_provider)
        self.session = self.cluster.connect()

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
