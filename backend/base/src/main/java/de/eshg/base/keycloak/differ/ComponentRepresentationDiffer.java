/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak.differ;

import de.eshg.base.keycloak.PropertyUpdater;
import java.util.List;
import org.keycloak.representations.idm.ComponentRepresentation;

public class ComponentRepresentationDiffer extends KeycloakDiffer<ComponentRepresentation> {
  private static PropertyUpdater<ComponentRepresentation> clientRepresentationUpdater() {
    return (target, source) -> {
      target.setName(source.getName());
      target.setProviderId(source.getProviderId());
      target.setProviderType(source.getProviderType());
      target.setConfig(source.getConfig());
    };
  }

  public ComponentRepresentationDiffer(
      List<ComponentRepresentation> target, List<ComponentRepresentation> source) {
    super(target, source, clientRepresentationUpdater(), ComponentRepresentation::getName);
  }
}
