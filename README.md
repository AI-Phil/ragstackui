# RAGStack UI

The intent of this repository is to demonstrate how to use the Python-based RAGStack (a curated GenAI stack based on Langchain, with built-in integration to DataStax Astra) in conjunction with a Next.js-based server.

It should help you understand how to build some common GenAI use cases that use RAG techniques.

**Note:** This repostiory is for demonstration purposes only, and should not be taken directly into production enviornments without modifying for security (e.g. HTTPS, CORS, user authentication, etc) and other concerns.

## Requirements

You should have a [DataStax Astra Vector Search](https://www.datastax.com/products/vector-search) database created.

You need to be able to run `docker` and `docker compose` commands (or their equivalents).

The instructions also assume you are not running services on the following network ports:
* 3000 : Webserver (Next.js)
* 8000 : Python server (FastAPI)

Optionally, you may wish to run a DataStax Enterprise container, in which case port 9042 must also be open. In order to use the DSE container, you must be licensed to use DSE and configure `DS_LICENCE=accept` in the `.env` file below. By setting `DS_LICENCE=accept` you are agreeing to the DataStax License, see https://www.datastax.com/legal/msa.

## Getting Started

### Download

Download this repository, either using `git` or simply download and unzip.

### Environment File

Create a copy of `.env.template` into a file named `.env`, and edit that file per the included comments. This includes setting 
up your API keys, Astra connection, etc.

### Docker Network

Create a Docker network with the following command:

```bash
docker network create ragstack-net
```

### DSE with Apple M-based Macs

This section only applies if you are:

1. Using DSE container
2. On an Apple M-based Mac

Edit `dse/Dockerfile`. You need to comment out (by adding a `#` to start of the line):

```
FROM cr.dtsx.io/datastax/dse-server:6.8.37
```

And comment in (by removing leading `#` from the line):

```
#FROM datastaxlabs/dse-server:6.8.34
```

The top of your `Dockerfile` should look like:

```
# x86-64 image:
#FROM cr.dtsx.io/datastax/dse-server:6.8.37
# Apple ARM image:
FROM datastaxlabs/dse-server:6.8.34
```

### Creating Services

To start services for the first you'll need to `up` them while also building:

```bash
docker compose up --build -d
```

## Using / Testing

You can now navigate to [http://localhost:3000/test-setup](http://localhost:3000/test-setup).

### Test CQL

Here you can test database connectivity to Astra where "Run CQL" should give you a result similar to

```
[
  {
    "data_center": "eu-west-1",
    "schema_version": "e3098d89-726b-3eea-ac99-64afc9e166c5"
  }
]
```

### Test LLM

Here "Run LLM" will generate an interesting-looking one day tour of a city.

## Maintaining 

### Pausing/Resuming Services

To suspend services and keep the server state:

```bash
docker compose stop
```

And to restart:
```bash
docker compose start
```

### Upgrading Project

To update to the latest version, simply download the latest code. From here simply create the services again (this command will delete and rebuild them):

```bash
docker compose up --build -d
```

One caveat: if you are running a local DSE service, you will want to amend the proess slightly if you wish to preserve the data within the DSE container:

```bash
docker compose up --build -d fastapi next_js
```

### Deleting Services

To remove this from your Docker environment:

```bash
docker compose down
docker network rm ragstack-net
```

## Contributing

Contributions are welcome! There are `README.md` within directories, and note that this is based on Python 3.11 and Next.js 14.1. The included DSE container is referencing DSE 6.8 with the Spark advanced workload.
