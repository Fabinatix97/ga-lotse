/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import static de.eshg.base.keycloak.KeycloakProvisioning.FALSE;

import java.util.List;
import java.util.Map;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BootstrapKeycloakProvisioning {

  private static final Logger log = LoggerFactory.getLogger(BootstrapKeycloakProvisioning.class);

  private BootstrapKeycloakProvisioning() {}

  public static void registerClient(
      RealmBoundKeycloakClient adminClient, KeycloakProperties keycloakProperties) {
    ClientRepresentation client = getAdminClientRepresentation(keycloakProperties);
    adminClient.createOrUpdateClients(List.of(client));
    RoleRepresentation adminRole = adminClient.getRealm().roles().get("admin").toRepresentation();
    adminClient.getRoleScopeResource(client.getClientId()).add(List.of(adminRole));

    log.info("Added admin role to service account for client '{}'", client.getId());
  }

  private static ClientRepresentation getAdminClientRepresentation(
      KeycloakProperties keycloakProperties) {
    ClientRepresentation client = new ClientRepresentation();
    client.setClientId(keycloakProperties.adminClient().getKeycloakClientId());
    client.setSecret(keycloakProperties.adminClient().getKeycloakClientSecret());
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
