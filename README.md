
The intent of this repository is to demonstrate how Generative AI can be used to extract value from a DSE 6.8 database with Spark. This uses the DSE Spark option, though a similar technique could be used with Apache Cassandra® and Apache Spark®.

## Requirements

1. Docker or equivalent container engine
2. Ability to accept a DSE license

## Setup
### DSE Container

#### Build Container
Run these commands within the `dse` directory. First, build the Docker image:

```
docker build -t text2sparksql:latest .
```

#### Start Container
Run the container, accepting the DSE license, and include the Spark `-k` option:

```
docker run -e DS_LICENSE=accept --name dse -d text2sparksql:latest -k
```

#### Wait for Container to Fully Start
Watch the logs:

```
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

```
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

```
docker cp dse:/opt/dse/output/ .
```

And you will now have an `output` directory with a `.csv` file named something like `part-00000-e2cd2fac-6840-4c81-afdb-f33d9fafbf65-c000.csv`. The contents of that file should be:

```
1,This is a test
```
