# Copyright 2025 cronn GmbH
# SPDX-License-Identifier: Apache-2.0

FROM node:22.16.0-alpine@sha256:9f3ae04faa4d2188825803bf890792f33cc39033c9241fc6bb201149470436ca

WORKDIR /app

RUN addgroup --system --gid 10001 eshg
RUN adduser --shell /usr/sbin/nologin --system --home /app --ingroup eshg --uid 10001 eshg

USER eshg:eshg

COPY resources/package.json ./
COPY resources/package-lock.json ./
COPY resources/server.js ./

HEALTHCHECK --interval=5s --timeout=2s --retries=3 --start-period=5s \
  CMD wget --spider -q http://localhost:8080/health

RUN npm ci

CMD ["node", "server.js"]
