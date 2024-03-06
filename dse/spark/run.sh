#!/bin/bash

dse spark --conf spark.cassandra.auth.username=cassandra --conf spark.cassandra.auth.password=${DSE_PASSWORD:-cassandra} "$@"