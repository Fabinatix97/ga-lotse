/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.authenticator;

import de.eshg.keycloak.credentialprovider.PinCredentialModel;
import jakarta.ws.rs.core.MultivaluedMap;
import java.util.Map;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.models.UserCredentialModel;
import org.keycloak.models.UserModel;
import org.keycloak.utils.StringUtil;

public class PinAccessCodeForm extends AccessCodeForm {

  public static final String FORM_TEMPLATE = "pin-access-code.ftl";
  public static final String PIN_FIELD = "pin";
  public static final String MISSING_PIN_MESSAGE = "missingPin";
  public static final String INVALID_CREDENTIALS_MESSAGE = "invalidAccessCodeOrPin";
  public static final String AUTHENTICATION_PROMPT = PinCredentialModel.TYPE;

  @Override
  protected void addContextInfo(
      AuthenticationFlowContext context, MultivaluedMap<String, String> formData) {
    formData.add(CONTEXT_INFO_QUERY_PARAMETER, "pinPageTitleInfo");
  }

  @Override
  protected String getAuthenticatorPrompt() {
    return AUTHENTICATION_PROMPT;
  }

  @Override
  protected String getInvalidCredentialsMessage() {
    return INVALID_CREDENTIALS_MESSAGE;
  }

  @Override
  protected void validateCredentialField(
      MultivaluedMap<String, String> formData, Map<String, String> errors) {
    if (StringUtil.isBlank(formData.getFirst(PIN_FIELD))) {
      errors.put(PIN_FIELD, MISSING_PIN_MESSAGE);
    }
  }

  @Override
  protected boolean validateCredentials(MultivaluedMap<String, String> formData, UserModel user) {
    String pin = formData.getFirst(PIN_FIELD);
    return user.credentialManager()
        .isValid(new UserCredentialModel(null, PinCredentialModel.TYPE, pin));
  }

  @Override
  protected String getCredentialsField() {
    return PIN_FIELD;
  }

  @Override
  protected String getFormTemplate() {
    return FORM_TEMPLATE;
  }
}
