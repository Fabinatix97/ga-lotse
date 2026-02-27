# Copyright 2026 cronn GmbH
# SPDX-License-Identifier: Apache-2.0

FROM node:22.22.0-alpine@sha256:a9cd9bac76cf2396abf14ff0d1c3671a8175fe577ce350e62ab0fc1678050176

WORKDIR /app

RUN addgroup --system --gid 10001 eshg
RUN adduser --shell /usr/sbin/nologin --system --home /app --ingroup eshg --uid 10001 eshg

RUN corepack enable
RUN corepack prepare pnpm --activate

USER eshg:eshg

COPY resources/.npmrc ./
COPY resources/package.json ./
COPY resources/pnpm-lock.yaml ./
COPY resources/server.js ./

HEALTHCHECK --interval=5s --timeout=2s --retries=3 --start-period=5s \
  CMD wget --spider -q http://localhost:8081/health

RUN pnpm install --frozen-lockfile --ignore-workspace

CMD ["node", "server.js"]
