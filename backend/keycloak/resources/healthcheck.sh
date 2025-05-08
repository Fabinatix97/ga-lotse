#!/bin/bash
# Copyright 2025 cronn GmbH
# SPDX-License-Identifier: Apache-2.0


set -e

exec 3<>/dev/tcp/localhost/9000

echo -e "GET /health HTTP/1.1
host: localhost:9000
" >&3

timeout 1 cat <&3 | grep status | grep UP 1>/dev/null 2>&1 || exit 1
