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
* 9042 : Cassandra / DSE

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

### Creating Services

To start services for the first you'll need to `up` them while also building:

```bash
docker compose up --build -d
```

## Using / Testing

You can now navigate to [http://localhost:3000/test-setup](http://localhost:3000/test-setup) where you can test database connectivity to Astra where "Run CQL" should give you a result similar to

```
[
  {
    "data_center": "eu-west-1",
    "schema_version": "e3098d89-726b-3eea-ac99-64afc9e166c5"
  }
]
```

And where "Run LLM" will generate an interesting-looking one day tour of a city.

From here, explore other demonstrators via the menu options.

## Maintaining 

### Pausing/Removing Services

To suspend services and keep the server state:

```bash
docker compose stop
```

And to restart:
```bash
docker compose start
```

### Deleting Services

To remove this from your Docker environment:

```bash
docker compose down
```

### Upgrading Project

To update to the latest version, simply download the latest code. From here simply create the services again:

```bash
docker compose up --build -d
```

One caveat: if you are running a local DSE service, you will want to amend the proess slightly if you wish to preserve the data within the DSE container:

```bash
docker compose up --build -d fastapi next_js
```

## Contributing

Contributions are welcome! There are `README.md` within directories, and note that this is based on Python 3.11 and Next.js 14.1. The included DSE container is referencing DSE 6.8 with the Spark advanced workload.
