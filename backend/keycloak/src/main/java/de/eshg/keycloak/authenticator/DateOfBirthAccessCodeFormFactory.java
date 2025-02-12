/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.authenticator;

import de.eshg.keycloak.credentialprovider.DateOfBirthCredentialModel;
import org.keycloak.authentication.Authenticator;
import org.keycloak.models.KeycloakSession;

public class DateOfBirthAccessCodeFormFactory extends AccessCodeFormFactory {

  static DateOfBirthAccessCodeForm SINGLETON = new DateOfBirthAccessCodeForm();

  @Override
  public String getCredentialType() {
    return DateOfBirthCredentialModel.TYPE;
  }

  @Override
  public String getFormattedCredentialType() {
    return "Date of Birth";
  }

  @Override
  public Authenticator create(KeycloakSession session) {
    return SINGLETON;
  }
}
