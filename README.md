
The intent of this repository is to demonstrate how Generative AI can be used to extract value from a DSE 6.8 database with Spark. This uses the DSE Spark option, though a similar technique could be used with Apache Cassandra® and Apache Spark®.

## Requirements

1. Docker or equivalent container engine
2. Ability to accept a DSE license

## Setup
### DSE Container

#### Build Container
Run these commands within the `dse` directory. First, build the Docker image:

```bash
docker build -t text2sparksql:latest .
```

#### Start Container
Run the container, accepting the DSE license, and include the Spark `-k` option:

```bash
docker run -e DS_LICENSE=accept --name dse --network dse-net -p 9042:9042 -d text2sparksql:latest -k
```

#### Wait for Container to Fully Start
Watch the logs:

```bash
docker logs --follow dse
```

Once the sample data is loaded you will see a log entry like:

```
*** DSE Ready - Setup Done ***
```

Once Spark is running you should see a log entry like:

```
INFO  [dispatcher-event-loop-5] 2024-03-06 09:50:57,433  Logging.scala:54 - Successfully registered with master spark://172.17.0.2:7077
```

#### Test the Container

Test the Spark install is working:

```bash
docker exec dse /tmp/spark/run.sh -i /tmp/spark/test.spark
```

You should see output like:

```
The log file is at /opt/dse/.spark-shell.log
Creating a new Spark Session
Spark context Web UI available at http://b4291d608b81:4040
Spark Context available as 'sc' (master = dse://?, app id = app-20240306100450-0004).
Spark Session available as 'spark'.
Spark SqlContext (Deprecated use Spark Session instead) available as 'sqlContext'
```

You can copy the output to your local machine:

```bash
docker cp dse:/opt/dse/output/ .
```

And you will now have an `output` directory with a `.csv` file named something like `part-00000-e2cd2fac-6840-4c81-afdb-f33d9fafbf65-c000.csv`. The contents of that file should be:

```
1,This is a test
```

### Fastapi Container

**Run these commands within the `fastapi` directory.**

#### Environment File

Create a copy of the `.env.template` file into a file called `.env`, and set up values as appropriate. You can leave `DSE_CONNECTION` as it is (it will connect to the `dse` Docker container, via the Docker network).

#### Build Container

```bash
docker build -t text2sparksql-fastapi:latest .
```

#### Start Container
Run the container (change exposed port if you wish, update other directives with this different port accordingly):

```bash
docker run --name fastapi --network dse-net -p 8080:80 --env-file ./.env -d text2sparksql-fastapi:latest
```

#### Test Container

First confirm the FastAPI server is running by navigating to [http://localhost:8080/](http://localhost:8080/). You should see a page with content:

```
Hello, World! Fastapi Container is Working!
```

Next confirm the CQL interface to DSE is working running by navigating to [http://localhost:8080/test-cql?db=dse](http://localhost:8080/test-cql?db=dse). You should see a page with content:

```
[{"data_center":"dc1","schema_version":"42ce1837-8122-3c50-b694-68185a247dd4"}]
```

Next confirm the CQL interface to Astra is working running by navigating to [http://localhost:8080/test-cql?db=astra](http://localhost:8080/test-cql?db=astra). You should see a page with content:

```
[{"data_center":"eu-west-1","schema_version":"e3098d89-726b-3eea-ac99-64afc9e166c5"}]
```

Next, confirm the LLM functions by navigating to [http://localhost:8080/test-llm?city=Dublin](http://localhost:8080/test-llm?city=Dublin). You should see a page with content similar to:

```
Here's a suggested one-day tour plan for Dublin:

Morning:
1. Start your day with a visit to the historic Dublin Castle, and explore its beautiful gardens and state apartments.

Mid-morning:
2. Walk over to Christ Church Cathedral, one of Dublin's most iconic landmarks, and take a guided tour to learn about its rich history and architecture.

Lunch:
3. Enjoy a traditional Irish lunch at a nearby cozy pub or restaurant, and savor some local specialties like Irish stew or fish and chips.

Afternoon:
4. Take a stroll through the bustling Temple Bar district, known for its colorful street art, lively pubs, and vibrant atmosphere.

Late afternoon:
5. Head to Trinity College and marvel at the famous Book of Kells, a beautifully illuminated manuscript dating back to the 9th century, housed in the stunning library.

Evening:
6. Finish the day with a visit to the Guinness Storehouse, where you can learn about the brewing process, enjoy panoramic views of the city from the Gravity Bar, and savor a pint of Guinness.

This itinerary provides a great mix of historical landmarks, cultural experiences, and delicious Irish cuisine. Enjoy your day in Dublin!
```

### Next.js Container

**Run these commands within the `next.js` directory.**

#### Build Container

```bash
docker build --target production -t text2sparksql-next.js:latest .
```

#### Start Container
Run the container (change exposed port if you wish, update other directives with this different port accordingly):

```bash
docker run --name next.js --network dse-net -p 3030:3000 -d text2sparksql-next.js:latest
```

#### Test Container

First confirm the Next.js server is running by navigating to [http://localhost:3030/](http://localhost:3030/). You should see a page with a menu on the top, and page content:

```
Hello, World!
```

Navigate to [Test Setup](http://localhost:3030/test-setup). There are two subtabs, "Test CQL" and "Test LLM". Confirm that the two CQL databases (Astra and DSE) return back content similar to what you found in the FastAPI container testing, and that the LLM test will give you a day tour suggestion (try your own town/city).