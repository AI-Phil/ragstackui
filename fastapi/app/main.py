from fastapi import FastAPI, HTTPException, Query
from app.cql import CassandraConnector
import os
import openai
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser 

app = FastAPI()

cassandra_connector = CassandraConnector()

openai.api_key = os.getenv("OPENAI_API_KEY")

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

@app.get("/run-cql")
def run_cql(query: str = Query(..., min_length=1)):
    """
    Endpoint to run a provided CQL query string after basic sanity checks.
    """
    try:
        result_json = cassandra_connector.run_cql_query(query)
        return {"data": result_json}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while querying the database.")

@app.get("/test-llm")
def test_llm(city: str = Query("city", min_length=1)):
    try:
        chat_model = os.environ.get("OPENAI_CHAT_MODEL")
        llm = ChatOpenAI(temperature=0.9, model_name=chat_model)
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a travel agent who can create concise tour plans for users."),
            ("user", "Plan one day tour in {city}.")
        ])
        output_parser = StrOutputParser ()
        chain = prompt | llm | output_parser
        response = chain.invoke({"city": city})
        return {"data": response}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while invoking the LLM.")
    
    
