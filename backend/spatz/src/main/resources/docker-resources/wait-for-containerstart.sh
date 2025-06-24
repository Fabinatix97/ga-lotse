#!/usr/bin/env bash
# Copyright 2025 SCOOP Software GmbH, cronn GmbH
# SPDX-License-Identifier: Apache-2.0

#
# wait for SPATZ to be "up enough" to allow the application container to start
#

echo -n "waiting for SPATZ DNS to be available "
until curl --silent --fail http://localhost:8079/actuator/health/dns; do sleep 2; echo -n "."; done

echo "SPATZ DNS is now available"
