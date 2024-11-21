# Copyright 2024 cronn GmbH
# SPDX-License-Identifier: Apache-2.0

# This Dockerfile is necessary to workaround missing curl in Keycloak 21+ 🤯🤦
# See https://github.com/keycloak/keycloak/issues/17438
# and https://github.com/keycloak/keycloak/issues/17273

ARG keycloakVersion

FROM registry.access.redhat.com/ubi9:9.4-1214.1726694543@sha256:b00d5990a00937bd1ef7f44547af6c7fd36e3fd410e2c89b5d2dfc1aff69fe99 AS ubi-micro-build

FROM quay.io/keycloak/keycloak:$keycloakVersion AS keycloak-builder

ENV KC_HEALTH_ENABLED true
ENV KC_FEATURES_DISABLED impersonation,organization
ENV KC_DB postgres
ENV KC_CACHE local

WORKDIR /opt/keycloak

COPY ./keycloak-api-plain.jar ./providers/
COPY ./eshg-keycloak-plugin.jar ./providers/
COPY ./keycloak-extension-bundid.jar ./providers/
COPY ./resources/themes ./themes/

RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:$keycloakVersion
COPY --from=keycloak-builder /opt/keycloak/ /opt/keycloak/

# Note: The multi-stage build as described on https://github.com/keycloak/keycloak/blob/main/docs/guides/server/containers.adoc#installing-additional-rpm-packages
# DOES NOT WORK. The "dnf install" hangs during installation of curl.
# Instead, we use the brute force method here and copy curl and all libs from the ubi9 micro image
COPY --from=ubi-micro-build /usr/lib64/ /usr/lib64/
COPY --from=ubi-micro-build /usr/bin/curl /usr/bin/

ENV KC_HEALTH_ENABLED true
ENV KC_FEATURES_DISABLED impersonation,organization
ENV KC_DB postgres
ENV KC_CACHE local

HEALTHCHECK --start-period=120s --interval=5s CMD curl --silent --fail http://localhost:9000/health || exit 1
