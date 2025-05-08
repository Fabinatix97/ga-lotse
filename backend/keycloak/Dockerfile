# Copyright 2025 cronn GmbH
# SPDX-License-Identifier: Apache-2.0

ARG keycloakVersion

FROM quay.io/keycloak/keycloak:$keycloakVersion AS keycloak-builder

ENV KC_HEALTH_ENABLED=true \
    KC_FEATURES_DISABLED=impersonation,organization \
    KC_DB=postgres \
    KC_CACHE=local

WORKDIR /opt/keycloak

COPY ./keycloak-api-plain.jar ./providers/
COPY ./eshg-keycloak-plugin.jar ./providers/
COPY ./keycloak-extension-bundid.jar ./providers/
COPY ./resources/themes ./themes/

RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:$keycloakVersion

USER 0:0
RUN sed -i -e 's/keycloak:x:0:root/keycloak:x:10001:/g' /etc/group && \
    sed -i -e 's/keycloak:x:1000:0/keycloak:x:10001:100001/g' /etc/passwd
USER 10001:10001

COPY --chown=10001:10001 --from=keycloak-builder /opt/keycloak/ /opt/keycloak/
COPY ./resources/healthcheck.sh /

ENV KC_HEALTH_ENABLED=true \
    KC_FEATURES_DISABLED=impersonation,organization \
    KC_DB=postgres \
    KC_CACHE=local

HEALTHCHECK --start-period=120s --interval=5s CMD [ "/healthcheck.sh" ]

LABEL org.opencontainers.image.source="https://gitlab.com/ga-ffm/ga-lotse/ga-lotse-code" \
      org.opencontainers.image.description="Custom Keycloak image with plugin support and health checks"
