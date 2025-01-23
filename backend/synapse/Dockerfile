# Copyright 2025 cronn GmbH
# SPDX-License-Identifier: Apache-2.0

FROM matrixdotorg/synapse:v1.121.1@sha256:39ac223adee67024d9d5aecd679fdaeacaa1e348a6c4c999cb7270868486cbb5

RUN pip install --no-cache-dir jwcrypto

COPY resources/generate-homeserver-config.py /generate-homeserver-config.py
RUN chmod +x /generate-homeserver-config.py

COPY resources/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
