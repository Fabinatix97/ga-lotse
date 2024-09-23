/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.List;

public interface KeycloakUser {
  String TEST_USER_EMAIL_POSTFIX = "@eshg.de";

  String username();

  String email();

  String phoneNumber();

  String externalChatUsername();

  String firstName();

  String lastName();

  String password();

  List<KeycloakRole> roles();

  List<KeycloakGroup> groups();
}
