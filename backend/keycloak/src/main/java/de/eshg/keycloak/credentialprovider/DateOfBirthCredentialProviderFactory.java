/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.credentialprovider;

import org.keycloak.credential.CredentialProviderFactory;
import org.keycloak.models.KeycloakSession;

public class DateOfBirthCredentialProviderFactory
    implements CredentialProviderFactory<DateOfBirthCredentialProvider> {

  public static final String PROVIDER_ID = "date-of-birth";

  @Override
  public DateOfBirthCredentialProvider create(KeycloakSession session) {
    return new DateOfBirthCredentialProvider(session);
  }

  @Override
  public String getId() {
    return PROVIDER_ID;
  }
}
