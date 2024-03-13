from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import PlainTextResponse
from app.cql import CassandraConnectionsManager
import os
import openai
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser 

app = FastAPI()

connections_manager = CassandraConnectionsManager()
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.get("/")
def read_root():
    """
    Basic echo function  
    """
    return "Hello, World! Fastapi Container is Working!"

@app.get("/test-cql")
def test_cql(db: str = Query(..., min_length=1)):
    """
    Endpoint to test Cassandra CQL queries. 'db' specifies which database to query.
    """
    try:
        connector = connections_manager.get_connector(db)
        result_json = connector.run_cql_query("SELECT data_center, schema_version FROM system.local")
        return result_json
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while querying the database.")

@app.get("/run-cql")
def run_cql(query: str = Query(..., min_length=1), db: str = Query(..., min_length=1)):
    """
    Endpoint to run a provided CQL query string. 'db' specifies which database to query.
    """
    try:
        connector = connections_manager.get_connector(db)
        result_json = connector.run_cql_query(query)
        return result_json
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while querying the database.")

@app.get("/test-llm", response_class=PlainTextResponse)
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
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while invoking the LLM.")
    
    
