/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak.differ;

import de.eshg.base.keycloak.PropertyUpdater;
import java.util.List;
import org.keycloak.representations.idm.GroupRepresentation;

public class GroupRepresentationDiffer extends KeycloakDiffer<GroupRepresentation> {
  private static PropertyUpdater<GroupRepresentation> groupRepresentationUpdater() {
    return (target, source) -> {
      target.setName(source.getName());
      target.setRealmRoles(source.getRealmRoles().stream().sorted().toList());
    };
  }

  public GroupRepresentationDiffer(
      List<GroupRepresentation> target, List<GroupRepresentation> source) {
    super(target, source, groupRepresentationUpdater(), GroupRepresentation::getName);
  }
}
