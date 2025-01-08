# Copyright 2025 cronn GmbH
# SPDX-License-Identifier: Apache-2.0

FROM matrixdotorg/synapse:v1.114.0@sha256:0983d976eaaed08af558b8ce720caa89340124146e0c6e49042c9072acff7919

RUN pip install --no-cache-dir jwcrypto

COPY resources/generate-homeserver-config.py /generate-homeserver-config.py
RUN chmod +x /generate-homeserver-config.py

COPY resources/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
