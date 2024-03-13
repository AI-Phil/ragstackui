# Developer Notes

## Running local uvicorn service

**This should be run from within the `fastapi` directory.**

### Setup

1. Create a venv using Python 3.11 (not 3.12)
2. `pip install -r ./requirements.txt`
3. `pip install python-dotenv`
4. `cp .env .env.local` 

(Note the `.env` file will exist if you set up per the top-level README; it is a copy of `.env.template`).

Now edit the `.env.local` file:
* Modify the `DSE_CONNECTION` `"contact_points"` from `["dse"]` to `["localhost"]`. Port can be left the same if you have started DSE container as advised.

### Run Service

Start the FastAPI server:

```bash
python -m uvicorn app.main:app --reload --env-file ./.env.local --port 8090
```

The FastAPI service will start on port 8090:

```
INFO:     Will watch for changes in these directories: ['C:\\Users\\Phil\\git\\text2sparksql\\fastapi']
INFO:     Loading environment from './.env.local'
INFO:     Uvicorn running on http://127.0.0.1:8090 (Press CTRL+C to quit)
INFO:     Started reloader process [57072] using StatReload
INFO:     Started server process [2096]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

You can confirm this is working by visting:
* [http://localhost:8090/test-llm?city=Dublin](http://localhost:8090/test-llm?city=Dublin) to validate the LLM
* [http://localhost:8090/test-cql?db=astra](http://localhost:8090/test-cql?db=astra) to validate the CQL connection to Astra
* [http://localhost:8090/test-cql?db=dse](http://localhost:8090/test-cql?db=dse) to validate the CQL connection to DSE
