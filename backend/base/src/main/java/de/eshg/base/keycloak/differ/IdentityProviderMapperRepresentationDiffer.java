/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak.differ;

import de.eshg.base.keycloak.PropertyUpdater;
import java.util.List;
import java.util.TreeMap;
import org.keycloak.representations.idm.IdentityProviderMapperRepresentation;

public class IdentityProviderMapperRepresentationDiffer
    extends KeycloakDiffer<IdentityProviderMapperRepresentation> {

  public IdentityProviderMapperRepresentationDiffer(
      List<IdentityProviderMapperRepresentation> target,
      List<IdentityProviderMapperRepresentation> source) {
    super(
        sortConfigs(target),
        sortConfigs(source),
        identityProviderRepresentationUpdater(),
        IdentityProviderMapperRepresentation::getIdentityProviderMapper);
  }

  private static List<IdentityProviderMapperRepresentation> sortConfigs(
      List<IdentityProviderMapperRepresentation> mappers) {
    mappers.forEach(mapper -> mapper.setConfig(new TreeMap<>(mapper.getConfig())));
    return mappers;
  }

  private static PropertyUpdater<IdentityProviderMapperRepresentation>
      identityProviderRepresentationUpdater() {
    return (target, source) -> {
      target.setName(source.getName());
      target.setConfig(source.getConfig());
    };
  }
}
