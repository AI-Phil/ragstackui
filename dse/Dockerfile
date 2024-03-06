FROM cr.dtsx.io/datastax/dse-server:6.8.37

# COPY config/* /config

# Copy your custom scripts or configuration files
COPY --chmod=755 custom-entrypoint.sh /custom-entrypoint.sh
COPY --chmod=755 onetime-setup.sh /onetime-setup.sh
COPY --chmod=755 db/ /tmp/db/
COPY --chmod=755 spark/ /tmp/spark/

# Set your custom script as the entrypoint
ENTRYPOINT ["/custom-entrypoint.sh"]
