/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

public sealed interface PermissionRole extends KeycloakRole
    permits EmployeePermissionRole, CitizenPermissionRole {

  String name();
}
