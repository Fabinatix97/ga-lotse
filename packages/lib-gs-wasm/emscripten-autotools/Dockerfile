# Copyright 2026 SCOOP Software GmbH, cronn GmbH
# SPDX-License-Identifier: AGPL-3.0-only

FROM emscripten/emsdk:4.0.14

RUN apt-get update && \
    apt-get install -y automake

RUN cd $EMSDK/upstream/emscripten && \
    npm install
