/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.authenticator;

import java.util.List;
import org.keycloak.Config;
import org.keycloak.authentication.AuthenticatorFactory;
import org.keycloak.models.AuthenticationExecutionModel;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;

public abstract class AccessCodeFormFactory implements AuthenticatorFactory {

  @Override
  public String getDisplayType() {
    return "%s Access Code Form".formatted(getFormattedCredentialType());
  }

  @Override
  public String getReferenceCategory() {
    return "Access Code";
  }

  @Override
  public boolean isConfigurable() {
    return false;
  }

  @Override
  public AuthenticationExecutionModel.Requirement[] getRequirementChoices() {
    return REQUIREMENT_CHOICES;
  }

  @Override
  public boolean isUserSetupAllowed() {
    return false;
  }

  @Override
  public String getHelpText() {
    return "Validates a code and a %s credential from a form"
        .formatted(getFormattedCredentialType());
  }

  @Override
  public List<ProviderConfigProperty> getConfigProperties() {
    return null;
  }

  @Override
  public void init(Config.Scope config) {}

  @Override
  public void postInit(KeycloakSessionFactory factory) {}

  @Override
  public void close() {}

  @Override
  public String getId() {
    return getCredentialType() + "-access-code";
  }

  public abstract String getCredentialType();

  public abstract String getFormattedCredentialType();
}
