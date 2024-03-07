from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider

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
        try:
            rows = self.session.execute(query)
            result_json = [{column: getattr(row, column) for column in row._fields} for row in rows]
            return result_json
        except Exception as e:
            print(e)
            raise
