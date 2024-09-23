/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import java.util.List;

public enum KeycloakEventType {
  LOGIN,
  LOGIN_ERROR,
  ;

  public static final List<KeycloakEventType> ALL_LOGIN = List.of(LOGIN, LOGIN_ERROR);
}
