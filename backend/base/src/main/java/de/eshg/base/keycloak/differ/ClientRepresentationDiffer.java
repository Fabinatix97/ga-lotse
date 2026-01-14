/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak.differ;

import de.eshg.base.keycloak.PropertyUpdater;
import java.util.List;
import org.keycloak.representations.idm.ClientRepresentation;

public class ClientRepresentationDiffer extends KeycloakDiffer<ClientRepresentation> {
  private static PropertyUpdater<ClientRepresentation> clientRepresentationUpdater() {
    return (target, source) -> {
      target.setClientId(source.getClientId());
      target.setName(source.getName());
      target.setDescription(source.getDescription());
      target.setPublicClient(source.isPublicClient());
      target.setRootUrl(source.getRootUrl());
      target.setBaseUrl(source.getBaseUrl());
      target.setAdminUrl(source.getAdminUrl());
      target.setFrontchannelLogout(source.isFrontchannelLogout());
      target.setRedirectUris(source.getRedirectUris());
      target.setWebOrigins(source.getWebOrigins());
      target.setSecret(source.getSecret());
      target.setAttributes(source.getAttributes());
      target.setDefaultClientScopes(source.getDefaultClientScopes());
      target.setOptionalClientScopes(source.getOptionalClientScopes());
    };
  }

  private static List<ClientRepresentation> sortClientScopes(List<ClientRepresentation> clients) {
    clients.forEach(ClientRepresentationDiffer::sortClientScopes);
    return clients;
  }

  private static void sortClientScopes(ClientRepresentation client) {
    List<String> defaultClientScopes = client.getDefaultClientScopes();
    if (defaultClientScopes != null) {
      client.setDefaultClientScopes(defaultClientScopes.stream().sorted().toList());
    }
    List<String> optionalClientScopes = client.getOptionalClientScopes();
    if (optionalClientScopes != null) {
      client.setOptionalClientScopes(optionalClientScopes.stream().sorted().toList());
    }
  }

  public ClientRepresentationDiffer(
      List<ClientRepresentation> target, List<ClientRepresentation> source) {
    super(
        sortClientScopes(target),
        sortClientScopes(source),
        clientRepresentationUpdater(),
        ClientRepresentation::getClientId);
  }
}
