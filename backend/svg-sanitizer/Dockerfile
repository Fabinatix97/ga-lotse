# Copyright 2026 cronn GmbH
# SPDX-License-Identifier: Apache-2.0

FROM node:22.21.0-alpine@sha256:bd26af08779f746650d95a2e4d653b0fd3c8030c44284b6b98d701c9b5eb66b9

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
  CMD wget --spider -q http://localhost:8080/health

RUN pnpm install --frozen-lockfile --ignore-workspace

CMD ["node", "server.js"]
