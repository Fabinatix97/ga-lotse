This dev db dump contains 2 **synapse-only** (not integrated with keycloak) users:
```
@testuser1:synapse.local.dev
synapse login: testuser1
password: password
restore backup security key: EsTs ZxfZ rxhs h5nM 7Smu RbDB Uk55 C6ru gQn8 xSui uNUU Djzj

@testuser2:synapse.local.dev
synapse login: testuser2
password: password
restore backup security key: EsT8 CSVf R24j uurj Ymtj Fftz jHZA LpN5 Swhm Gup5 a6D5 eZQY
```

created with:
```shell
docker exec -it backend-synapse-1 /bin/bash

register_new_matrix_user -c /data/homeserver.yaml -u testuser1 -p password --no-admin http://localhost:8008
register_new_matrix_user -c /data/homeserver.yaml -u testuser2 -p password --no-admin http://localhost:8008
```

Secure backup for those users was created with `http://app.element.io`

This dump was created by executing this command on a running container:
```shell
docker exec -t backend-synapse-db-1 pg_dump -U synapse -d synapse > pg_dump.synapse.local.dev.sql
```
