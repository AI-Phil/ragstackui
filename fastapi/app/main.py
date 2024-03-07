from fastapi import FastAPI, HTTPException
from app.cql import CassandraConnector

app = FastAPI()

cassandra_connector = CassandraConnector()

@app.get("/")
def read_root():
    """
    Basic echo function  
    """
    return {"message": "Hello, World! Fastapi Container is Working!"}

@app.get("/test-cql")
def test_cql():
    """
    Endpoint to test Cassandra CQL queries.
    """
    try:
        result_json = cassandra_connector.run_cql_query("SELECT * FROM test.test_table")
        return {"data": result_json}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while querying the database.")


# # Test DSE Spark
# @app.get("/test-dse")
# def test_dse():
#     try:
#         result_json = run_sql_query("SELECT * FROM test.test_table")
#         return {"data": result_json}
#     except Exception as e:
#         print(e)
#         raise HTTPException(status_code=500, detail="An error occurred while querying the Spark cluster.")
