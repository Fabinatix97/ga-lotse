/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.authenticator;

import de.eshg.keycloak.credentialprovider.PinCredentialModel;
import org.keycloak.authentication.Authenticator;
import org.keycloak.models.KeycloakSession;

public class PinAccessCodeFormFactory extends AccessCodeFormFactory {

  static PinAccessCodeForm SINGLETON = new PinAccessCodeForm();

  @Override
  public String getCredentialType() {
    return PinCredentialModel.TYPE;
  }

  @Override
  public String getFormattedCredentialType() {
    return "PIN";
  }

  @Override
  public Authenticator create(KeycloakSession session) {
    return SINGLETON;
  }
}
