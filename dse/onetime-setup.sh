#!/bin/bash

# Path to a flag file that indicates setup has already been completed
SETUP_DONE="/tmp/setup_done.flag"

# Check if the password has already been changed
if [ -f "$SETUP_DONE" ]; then
    echo "Setup already done. Exiting."
    exit 0
fi

if [ -z "${DS_LICENSE}" -o "${DS_LICENSE}" != "accept" ]; then
    echo "Not running the DSE setup because the DS_LICENSE variable is not set to 'accept'"
    touch $SETUP_DONE
    exit 0
fi

echo "Setting Up DSE Database"

# sleep until DSE is ready
echo "*** Checking if DSE Ready *** "
while ! cqlsh -u cassandra -p cassandra -e 'describe cluster' ; do
    echo "Waiting on DSE"
    sleep 10
done

echo "*** DSE Ready - Installing Schema *** "
# set up the schema
#cqlsh -u cassandra -p cassandra -e "ALTER USER cassandra WITH PASSWORD '${DSE_PASSWORD:-cassandra}';"
cqlsh -u cassandra -p ${DSE_PASSWORD:-cassandra} -f /tmp/db/test/keyspace.cql
cqlsh -u cassandra -p ${DSE_PASSWORD:-cassandra} -f /tmp/db/test/table.cql

echo "*** DSE Ready - Adding Test Data *** "
# run data population
cqlsh -u cassandra -p ${DSE_PASSWORD:-cassandra} -f /tmp/db/test/data.cql

echo "*** DSE Ready - Setup Done *** "

touch $SETUP_DONE