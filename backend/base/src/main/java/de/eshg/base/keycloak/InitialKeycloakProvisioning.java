/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.InitialKeycloakProvisioning.BEAN_NAME;
import static de.eshg.base.keycloak.KeycloakProvisioning.FALSE;

import jakarta.ws.rs.NotAuthorizedException;
import java.util.List;
import java.util.Map;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component(BEAN_NAME)
public class InitialKeycloakProvisioning {
  public static final String BEAN_NAME = "initialKeycloakProvisioning";

  private static final Logger log = LoggerFactory.getLogger(InitialKeycloakProvisioning.class);
  private final KeycloakProperties keycloakProperties;

  public InitialKeycloakProvisioning(KeycloakProperties keycloakProperties) {
    this.keycloakProperties = keycloakProperties;

    ClientRepresentation client = getAdminClientRepresentation();
    RealmBoundKeycloakClient adminUserClient = getAdminUserClient();
    if (adminUserClient == null) return;

    try (adminUserClient) {
      registerClient(adminUserClient, client);
    }
  }

  private RealmBoundKeycloakClient getAdminUserClient() {
    try {
      return new RealmBoundKeycloakClient(this.keycloakProperties, "master", false);
    } catch (KeycloakException e) {
      if (e.getCause().getCause() instanceof NotAuthorizedException) {
        log.debug("Could not register client because default admin account is inaccessible", e);
        return null;
      } else throw e;
    }
  }

  private void registerClient(
      RealmBoundKeycloakClient adminUserClient, ClientRepresentation client) {
    adminUserClient.createOrUpdateClients(List.of(client));
    RoleRepresentation adminRole =
        adminUserClient.getRealm().roles().get("admin").toRepresentation();
    adminUserClient.getRoleScopeResource(client.getClientId()).add(List.of(adminRole));

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
