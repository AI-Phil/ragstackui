#!/bin/bash

/onetime-setup.sh &

# Call the original entrypoint script with the original arguments plus any new ones passed at runtime
exec /entrypoint.sh dse cassandra -f "$@"
