/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.List;

public interface KeycloakGroup {
  String SYSTEM_PREFIX = "[System] ";

  default String getKeycloakName() {
    return SYSTEM_PREFIX + getKeycloakNameWithoutPrefix();
  }

  String getKeycloakNameWithoutPrefix();

  List<? extends KeycloakRole> roles();
}
