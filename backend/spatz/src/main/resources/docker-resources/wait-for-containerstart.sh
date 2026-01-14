#!/usr/bin/env bash
# Copyright 2026 SCOOP Software GmbH, cronn GmbH
# SPDX-License-Identifier: Apache-2.0

#
# wait for SPATZ to be "up enough" to allow the application container to start
#

echo -n "waiting for SPATZ DNS to be available "
until { exec 3<>/dev/tcp/localhost/8079 && \
        printf 'GET /actuator/health/dns HTTP/1.0\r\n\r\n' >&3 && \
        head -n 1 <&3 | grep -q 'HTTP/1\.. 200'; } 2>/dev/null; do
    sleep 2
    echo -n "."
done

echo "SPATZ DNS is now available"
