# Copyright 2026 cronn GmbH
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

RUN echo $(( $(date +%s) / 3600 * 3600 )) > provider-timestamp.txt

USER root:root
RUN touch -m --date=@$(cat provider-timestamp.txt) ./providers/*
USER keycloak:root

RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:$keycloakVersion

USER 0:0
RUN sed -i -e 's/keycloak:x:0:root/keycloak:x:10001:/g' /etc/group && \
    sed -i -e 's/keycloak:x:1000:0/keycloak:x:10001:10001/g' /etc/passwd
USER 10001:10001

COPY --chown=10001:10001 --from=keycloak-builder /opt/keycloak/ /opt/keycloak/

ENV KC_HEALTH_ENABLED=true \
    KC_FEATURES_DISABLED=impersonation,organization \
    KC_DB=postgres \
    KC_CACHE=local

HEALTHCHECK --start-period=120s --interval=5s CMD [ "bash", "-c", "{ printf 'HEAD /health/ready HTTP/1.0\r\n\r\n' >&0; grep 'HTTP/1.0 200'; } 0<>/dev/tcp/localhost/9000" ]

LABEL org.opencontainers.image.source="https://gitlab.com/ga-ffm/ga-lotse/ga-lotse-code" \
      org.opencontainers.image.description="Custom Keycloak image with plugin support and health checks"
