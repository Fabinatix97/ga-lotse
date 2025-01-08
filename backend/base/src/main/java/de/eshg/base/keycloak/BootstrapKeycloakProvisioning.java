/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.BootstrapKeycloakProvisioning.BEAN_NAME;
import static de.eshg.base.keycloak.KeycloakProvisioning.FALSE;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component(BEAN_NAME)
public class BootstrapKeycloakProvisioning {
  public static final String BEAN_NAME = "bootstrapKeycloakProvisioning";

  private static final Logger log = LoggerFactory.getLogger(BootstrapKeycloakProvisioning.class);
  private final KeycloakProperties keycloakProperties;

  public BootstrapKeycloakProvisioning(KeycloakProperties keycloakProperties) {
    this.keycloakProperties = keycloakProperties;
  }

  @PostConstruct
  void setupClient() {
    RealmBoundKeycloakClient bootstrapAdminClient = getBootstrapAdminUserClient();
    if (bootstrapAdminClient == null) return;

    try (bootstrapAdminClient) {
      registerClient(bootstrapAdminClient);
    }
  }

  private RealmBoundKeycloakClient getBootstrapAdminUserClient() {
    if (!this.keycloakProperties.bootstrapAdmin().enabled()) {
      log.debug("Skipping keycloak bootstrap provisioning. The bootstrap admin is disabled.");
      return null;
    }

    return new RealmBoundKeycloakClient(this.keycloakProperties, "master", false);
  }

  public void registerClient(RealmBoundKeycloakClient adminClient) {
    ClientRepresentation client = getAdminClientRepresentation();
    adminClient.createOrUpdateClients(List.of(client));
    RoleRepresentation adminRole = adminClient.getRealm().roles().get("admin").toRepresentation();
    adminClient.getRoleScopeResource(client.getClientId()).add(List.of(adminRole));

    log.info("Added admin role to service account for client '{}'", client.getId());
  }

  private ClientRepresentation getAdminClientRepresentation() {
    ClientRepresentation client = new ClientRepresentation();
    client.setClientId(this.keycloakProperties.adminClient().getKeycloakClientId());
    client.setSecret(this.keycloakProperties.adminClient().getKeycloakClientSecret());
    client.setAuthorizationServicesEnabled(false);
    client.setServiceAccountsEnabled(true);
    client.setPublicClient(false);
    client.setStandardFlowEnabled(false);
    client.setEnabled(true);
    client.setName("GA-Lotse Base Module Client");
    client.setDescription(
        "Used by the GA-Lotse base module for provisioning and managing this keycloak instance.");
    client.setAttributes(Map.of("realm_client", FALSE));

    return client;
  }
}
