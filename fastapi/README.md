# Developer Notes

## Running local uvicorn service

**This should be run from within the `fastapi` directory.**

### Setup

1. Create a venv using Python 3.11 (not 3.12)
2. `pip install -r ./requirements.txt`
3. `pip install python-dotenv`
4. `cp ../.env .env.development` 

(Note the `.env` file will exist if you set up per the top-level README; it is a copy of `.env.template`).

If you are using DSE, edit the `.env.development` file:
* Modify the `DSE_CONNECTION` `"contact_points"` from `["dse"]` to `["localhost"]`. Port can be left the same if you have started DSE container as advised.

### Run Service

**Confirm the `fastapi-dev` Docker container is not running!**

Start the FastAPI server:

Activate your `venv`:
```bash
./.venv/Scripts/activate
```

```bash
python -m uvicorn app.main:app --reload --env-file ./.env.development --port 8001 --log-level debug
```

The FastAPI service will start on port 8001:

```
INFO:     Will watch for changes in these directories: ['C:\\Users\\Phil\\git\\text2sparksql\\fastapi']
INFO:     Loading environment from './.env.local'
INFO:     Uvicorn running on http://127.0.0.1:8001 (Press CTRL+C to quit)
INFO:     Started reloader process [57072] using StatReload
INFO:     Started server process [2096]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Validating Setup

You can confirm this is working by visting:
* [http://localhost:8001/test-llm?city=Dublin](http://localhost:8001/test-llm?city=Dublin) to validate the LLM
* [http://localhost:8001/test-cql?db=astra](http://localhost:8001/test-cql?db=astra) to validate the CQL connection to Astra
* [http://localhost:8001/test-cql?db=dse](http://localhost:8001/test-cql?db=dse) to validate the CQL connection to DSE


## Running Individual Docker Container

The FastAPI service is bundled into a container which is itself bundled into a `docker-compose.yaml` in the project root directory. 
If you need to make changes to the FastAPI `Dockerfile`, this section is for you.

**Run these commands within the `fastapi` directory.**

### Environment File

The project `.env` file will be used, as this container will run within the same network as is referenced by the Docker Compose configuration.

### Build Container

```bash
docker build -t ragstackui-fastapi-dev:latest .
```

### Start Container

**Confirm the local uvicorn service is not running!**

You can start the containers as follows. 

```bash
docker run --name fastapi-dev --net ragstack-net -p 8001:8000 --env-file ../.env -d ragstackui-fastapi-dev:latest
```

### Validating Setup

Setup is validated as above.
