/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.api;

public record TestHelperLoginRequest(String username, String password, RealmDto realm) {

  public TestHelperLoginRequest(String username, String password, RealmDto realm) {
    this.username = username;
    this.password = password;
    this.realm = realm != null ? realm : RealmDto.EMPLOYEES;
  }
}
