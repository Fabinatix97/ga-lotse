/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.credentialprovider;

import org.keycloak.credential.CredentialProviderFactory;
import org.keycloak.models.KeycloakSession;

public class PinCredentialProviderFactory
    implements CredentialProviderFactory<PinCredentialProvider> {

  public static final String PROVIDER_ID = "pin";

  @Override
  public PinCredentialProvider create(KeycloakSession session) {
    return new PinCredentialProvider(session);
  }

  @Override
  public String getId() {
    return PROVIDER_ID;
  }
}
