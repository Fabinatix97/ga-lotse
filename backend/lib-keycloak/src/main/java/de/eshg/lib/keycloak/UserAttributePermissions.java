/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public enum UserAttributePermissions {
  ALL(PermittedRoles.USER_AND_ADMIN, PermittedRoles.USER_AND_ADMIN),
  ADMIN_READ_ONLY(PermittedRoles.ADMIN, PermittedRoles.NONE),
  ADMIN_ONLY(PermittedRoles.ADMIN, PermittedRoles.ADMIN);

  private final PermittedRoles viewPermissions;
  private final PermittedRoles editPermissions;

  UserAttributePermissions(PermittedRoles viewPermissions, PermittedRoles editPermissions) {
    this.viewPermissions = viewPermissions;
    this.editPermissions = editPermissions;
  }

  public Set<String> viewPermissions() {
    return viewPermissions.getRoles();
  }

  public Set<String> editPermissions() {
    return editPermissions.getRoles();
  }

  private enum PermittedRoles {
    NONE(),
    USER("user"),
    ADMIN("admin"),
    USER_AND_ADMIN("user", "admin");

    private final Set<String> roles;

    PermittedRoles(String... roles) {
      this.roles = new LinkedHashSet<>(List.of(roles));
    }

    public Set<String> getRoles() {
      return roles;
    }
  }
}
