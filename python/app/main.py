# This from https://fastapi.tiangolo.com/deployment/docker/#build-a-docker-image-for-fastapi 

from typing import Union

from fastapi import FastAPI

app = FastAPI()

# Basic echo function
@app.get("/")
def read_root():
    return {"Hello": "World"}

# Simple query function
@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
