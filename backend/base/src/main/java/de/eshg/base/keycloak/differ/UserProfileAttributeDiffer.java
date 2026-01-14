/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak.differ;

import de.eshg.base.keycloak.PropertyUpdater;
import java.util.List;
import java.util.TreeSet;
import org.keycloak.representations.userprofile.config.UPAttribute;
import org.keycloak.representations.userprofile.config.UPAttributeRequired;

public class UserProfileAttributeDiffer extends KeycloakDiffer<UPAttribute> {

  public UserProfileAttributeDiffer(List<UPAttribute> target, List<UPAttribute> source) {
    super(
        sortPermissions(target),
        sortPermissions(source),
        userProfileAttributeUpdater(),
        UPAttribute::getName);
  }

  private static List<UPAttribute> sortPermissions(List<UPAttribute> attributes) {
    attributes.stream()
        .map(UPAttribute::getPermissions)
        .forEach(
            permission -> {
              permission.setView(new TreeSet<>(permission.getView()));
              permission.setEdit(new TreeSet<>(permission.getEdit()));
            });
    return attributes;
  }

  private static PropertyUpdater<UPAttribute> userProfileAttributeUpdater() {
    return (target, source) -> {
      target.setDisplayName(source.getDisplayName());
      target.setGroup(source.getGroup());
      target.setPermissions(source.getPermissions());
      configureAttributeRequired(target, source);
      target.setValidations(source.getValidations());
    };
  }

  private static void configureAttributeRequired(
      UPAttribute targetAttribute, UPAttribute sourceAttribute) {
    if (sourceAttribute.getRequired() != null) {
      UPAttributeRequired existingRequiredConfig = targetAttribute.getRequired();
      UPAttributeRequired requiredConfig =
          existingRequiredConfig != null ? existingRequiredConfig : new UPAttributeRequired();
      requiredConfig.setRoles(null);
      targetAttribute.setRequired(requiredConfig);
    } else {
      targetAttribute.setRequired(null);
    }
  }
}
