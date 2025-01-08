/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak.differ;

import de.eshg.base.keycloak.PropertyUpdater;
import java.util.List;
import org.keycloak.representations.idm.ProtocolMapperRepresentation;

public class ProtocolMapperDiffer extends KeycloakDiffer<ProtocolMapperRepresentation> {
  private static PropertyUpdater<ProtocolMapperRepresentation>
      protocolMapperRepresentationUpdater() {
    return (target, source) -> {
      target.setName(source.getName());
      target.setProtocol(source.getProtocol());
      target.setProtocolMapper(source.getProtocolMapper());
      target.setConfig(source.getConfig());
    };
  }

  public ProtocolMapperDiffer(
      List<ProtocolMapperRepresentation> target, List<ProtocolMapperRepresentation> source) {
    super(
        target,
        source,
        protocolMapperRepresentationUpdater(),
        ProtocolMapperRepresentation::getName);
  }
}
