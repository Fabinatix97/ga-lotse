Sole purpose of this synapse pg_dump is to improve synapse server and synapse-db startup time during builds.

This dump was created by executing this command on a running container:
```shell
docker exec -t backend-synapse-db-1 pg_dump -U synapse -d synapse > pg_dump.synapse.local.dev.sql
```
