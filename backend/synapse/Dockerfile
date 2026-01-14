# Copyright 2026 cronn GmbH
# SPDX-License-Identifier: Apache-2.0

FROM matrixdotorg/synapse:v1.128.0@sha256:5765b7f1bd46b3ded0a59546c8e69b33e57ef6007854791701943f0414557e39

RUN pip install --no-cache-dir jwcrypto

COPY resources/generate-homeserver-config.py /generate-homeserver-config.py
RUN chmod +x /generate-homeserver-config.py

COPY resources/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
