# Developer Notes

**This should be run from within the `dse` directory.**

#### Test the Container

Test the Spark install is working:

```bash
docker exec ragstackui-dse-1 /tmp/spark/run.sh -i /tmp/spark/test.spark
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
docker cp ragstackui-dse-1:/opt/dse/output/ .
```

And you will now have an `output` directory with a `.csv` file named something like `part-00000-e2cd2fac-6840-4c81-afdb-f33d9fafbf65-c000.csv`. The contents of that file should be:

```
1,This is a test
```

