/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.List;
import java.util.Map;

public interface KeycloakUser {
  String TEST_USER_EMAIL_POSTFIX = "@ga-lotse.de";

  String username();

  String email();

  String phoneNumber();

  String externalChatUsername();

  String firstName();

  String lastName();

  String password();

  List<KeycloakRole> roles();

  List<KeycloakGroup> groups();

  Map<String, String> additionalAttributes();
}
