/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.authenticator;

import java.util.List;
import org.jboss.logging.Logger;
import org.keycloak.Config;
import org.keycloak.authentication.Authenticator;
import org.keycloak.authentication.AuthenticatorFactory;
import org.keycloak.models.AuthenticationExecutionModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;

// ToDo: remove after all environments migrated to new dob-authenticator
@Deprecated(since = "forever")
public class DeprecatedAccessCodeFormFactory implements AuthenticatorFactory {

  private static final Logger logger = Logger.getLogger(DeprecatedAccessCodeFormFactory.class);

  @Override
  public String getDisplayType() {
    return "Access Code Form";
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
    return "";
  }

  @Override
  public List<ProviderConfigProperty> getConfigProperties() {
    return null;
  }

  @Override
  public Authenticator create(KeycloakSession keycloakSession) {
    logger.warn("Access Code Form created from deprecated Factory!");
    return new DateOfBirthAccessCodeForm();
  }

  @Override
  public void init(Config.Scope config) {
    logger.warn("DeprecatedAccessCodeFormFactory initialized!");
  }

  @Override
  public void postInit(KeycloakSessionFactory factory) {
    logger.warn("DeprecatedAccessCodeFormFactory post init!");
  }

  @Override
  public void close() {}

  @Override
  public String getId() {
    return "access-code";
  }
}
