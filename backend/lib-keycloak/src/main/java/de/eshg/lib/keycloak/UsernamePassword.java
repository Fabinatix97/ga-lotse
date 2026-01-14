/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

public record UsernamePassword(String username, String password, Realm realm) {

  public UsernamePassword(String username, String password) {
    this(username, password, Realm.EMPLOYEES);
  }
}
