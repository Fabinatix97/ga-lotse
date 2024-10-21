/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.keycloak;

import static de.eshg.lsd.keycloak.LsdInitialSetupService.BEAN_NAME;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lsd.keycloak.properties.LsdInternalKeycloakProperties;
import de.eshg.lsd.register.api.LsdClientKeycloakProperties;
import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.ClientResource;
import org.keycloak.admin.client.resource.ClientsResource;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.RealmsResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.RealmRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component(BEAN_NAME)
public class LsdInitialSetupService {
  public static final String BEAN_NAME = "lsdInitialSetupService";
  private static final String REALM_MANAGEMENT_CLIENT_ID = "realm-management";

  private static final Logger log = LoggerFactory.getLogger(LsdInitialSetupService.class);

  private final LsdInternalKeycloakProperties internalProperties;
  private final LsdClientKeycloakProperties clientProperties;

  public LsdInitialSetupService(
      LsdInternalKeycloakProperties internalProperties,
      LsdClientKeycloakProperties clientProperties) {
    this.internalProperties = internalProperties;
    this.clientProperties = clientProperties;
    Keycloak keycloak = tryCreateKeycloakAdminCliClient();
    if (keycloak != null) {
      try (keycloak) {
        setupRealm(keycloak);
        setupClient(keycloak);
      }
    }
  }

  private void setupRealm(Keycloak keycloak) {
    RealmsResource realmsResource = keycloak.realms();

    if (realmsResource.findAll().stream()
        .anyMatch(realm -> clientProperties.realm().equals(realm.getRealm()))) {
      log.info("Found existing realm '{}'", clientProperties.realm());
      return;
    }

    RealmRepresentation realmRepresentation = new RealmRepresentation();
    realmRepresentation.setDisplayName(internalProperties.realmDisplayName());
    realmRepresentation.setRealm(clientProperties.realm());
    realmRepresentation.setEnabled(true);

    realmsResource.create(realmRepresentation);
    log.info("Created new realm '{}'", realmRepresentation.getRealm());
    keycloak.tokenManager().refreshToken();
  }

  private void setupClient(Keycloak keycloak) {
    RealmResource realmResource = keycloak.realm(clientProperties.realm());

    ClientsResource clientsResource = realmResource.clients();

    ClientRepresentation lsdAdminClient =
        getClientByClientId(clientsResource, internalProperties.adminClient().clientId())
            .map(ClientResource::toRepresentation)
            .orElseGet(() -> tryCreateClient(clientsResource));

    ClientResource realmManagementClient =
        getClientByClientIdOrThrow(clientsResource, REALM_MANAGEMENT_CLIENT_ID);
    List<RoleRepresentation> realmManagementRoles = realmManagementClient.roles().list();

    ClientResource clientResource = clientsResource.get(lsdAdminClient.getId());
    UserResource serverAccountUser =
        realmResource.users().get(clientResource.getServiceAccountUser().getId());

    serverAccountUser
        .roles()
        .clientLevel(realmManagementClient.toRepresentation().getId())
        .add(realmManagementRoles);

    log.info(
        "Added realm management roles to service account for client '{}'",
        lsdAdminClient.getClientId());
  }

  private static Optional<ClientResource> getClientByClientId(
      ClientsResource clients, String clientId) {
    return clients.findByClientId(clientId).stream()
        .filter(client -> clientId.equals(client.getClientId()))
        .map(client -> clients.get(client.getId()))
        .collect(StreamUtil.toSingleOptionalElement());
  }

  private static ClientResource getClientByClientIdOrThrow(
      ClientsResource clients, String clientId) {
    return getClientByClientId(clients, clientId)
        .orElseThrow(() -> new IllegalStateException("Could not find client '" + clientId + "'"));
  }

  private ClientRepresentation tryCreateClient(ClientsResource resource) {
    ClientRepresentation client = getAdminClientRepresentation();

    try (Response response = resource.create(client)) {
      Response.StatusType statusInfo = response.getStatusInfo();
      if (statusInfo.getFamily() != Response.Status.Family.SUCCESSFUL) {
        throw new IllegalStateException(
            statusInfo.getStatusCode() + ": " + statusInfo.getReasonPhrase());
      }
    }

    log.info("Created client '{}' for realm '{}'", client.getClientId(), clientProperties.realm());
    return getClientByClientIdOrThrow(resource, client.getClientId()).toRepresentation();
  }

  private Keycloak tryCreateKeycloakAdminCliClient() {
    try {
      Keycloak keycloak =
          KeycloakBuilder.builder()
              .serverUrl(internalProperties.url())
              .grantType(OAuth2Constants.PASSWORD)
              .realm("master")
              .clientId("admin-cli")
              .username(internalProperties.adminUser().user())
              .password(internalProperties.adminUser().password())
              .build();

      log.info(
          "Connected to Keycloak on '{}'. Keycloak version: {}",
          internalProperties.url(),
          keycloak.serverInfo().getInfo().getSystemInfo().getVersion());

      return keycloak;
    } catch (Exception e) {
      if (e.getCause() instanceof NotAuthorizedException) {
        log.info("Could not login with admin user for initial setup");
        return null;
      }

      throw e;
    }
  }

  private ClientRepresentation getAdminClientRepresentation() {
    ClientRepresentation client = new ClientRepresentation();
    client.setClientId(internalProperties.adminClient().clientId());
    client.setSecret(internalProperties.adminClient().clientSecret());
    client.setEnabled(true);
    client.setAuthorizationServicesEnabled(false);
    client.setServiceAccountsEnabled(true);
    client.setPublicClient(false);
    client.setStandardFlowEnabled(false);

    client.setName("GA-Lotse Local Service Directory Client");
    client.setDescription("Used by the local service directory to manage actors in the directory.");
    return client;
  }
}
