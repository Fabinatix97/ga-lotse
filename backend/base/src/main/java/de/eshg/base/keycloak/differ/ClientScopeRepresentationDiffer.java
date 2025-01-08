/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak.differ;

import de.eshg.base.keycloak.PropertyUpdater;
import java.util.List;
import org.keycloak.representations.idm.ClientScopeRepresentation;

public class ClientScopeRepresentationDiffer extends KeycloakDiffer<ClientScopeRepresentation> {
  private static PropertyUpdater<ClientScopeRepresentation> clientScopeRepresentationUpdater() {
    return (target, source) -> {
      target.setName(source.getName());
      target.setDescription(source.getDescription());
      target.setProtocol(source.getProtocol());
      target.setAttributes(source.getAttributes());
    };
  }

  public ClientScopeRepresentationDiffer(
      List<ClientScopeRepresentation> target, List<ClientScopeRepresentation> source) {
    super(target, source, clientScopeRepresentationUpdater(), ClientScopeRepresentation::getName);
  }
}
