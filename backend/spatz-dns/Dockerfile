# Copyright 2024 SCOOP Software GmbH, cronn GmbH
# SPDX-License-Identifier: Apache-2.0

#
# Simple forwarding DNS Server that is used for docker-compose setups of SPATZ to simulate a fixed
# DNS server that is reachable via a docker network IP-address (in contrast to 127.0.0.11)
#
# This container will not be needed in a real K8S environment
#
FROM alpine:3.19.1

RUN apk add dnsmasq bind-tools curl

CMD dnsmasq -dh
