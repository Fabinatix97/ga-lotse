/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.authenticator;

import de.eshg.keycloak.api.user.KeycloakAttributes;
import de.eshg.keycloak.credentialprovider.DateOfBirthCredentialModel;
import jakarta.ws.rs.core.MultivaluedMap;
import java.util.Map;
import java.util.Objects;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.models.UserCredentialModel;
import org.keycloak.models.UserModel;
import org.keycloak.sessions.AuthenticationSessionModel;
import org.keycloak.utils.StringUtil;

public class DateOfBirthAccessCodeForm extends AccessCodeForm {

  public static final String FORM_TEMPLATE = "date-of-birth-access-code.ftl";
  public static final String DATE_OF_BIRTH_FIELD = "date_of_birth";
  public static final String MISSING_DATE_OF_BIRTH_MESSAGE = "missingDateOfBirth";
  public static final String INVALID_CREDENTIALS_MESSAGE = "invalidAccessCodeOrDateOfBirth";
  public static final String AUTHENTICATION_PROMPT = DateOfBirthCredentialModel.TYPE;

  @Override
  protected void addContextInfo(
      AuthenticationFlowContext context, MultivaluedMap<String, String> formData) {
    MultivaluedMap<String, String> queryParameters = context.getUriInfo().getQueryParameters();
    AuthenticationSessionModel authSession = context.getAuthenticationSession();
    String contextInfoKey =
        Objects.requireNonNullElse(
            queryParameters.getFirst(CONTEXT_INFO_QUERY_PARAMETER),
            Objects.requireNonNullElse(
                authSession.getAuthNote(CONTEXT_INFO_QUERY_PARAMETER), "default"));

    String contextInfoQueryParameter =
        switch (contextInfoKey) {
          case "esu" -> "esuDateOfBirthPageTitleInfo";
          case "tm" -> "tmDateOfBirthPageTitleInfo";
          case "oms" -> "omsDateOfBirthPageTitleInfo";
          default -> "defaultDateOfBirthPageTitleInfo";
        };
    formData.add(CONTEXT_INFO_QUERY_PARAMETER, contextInfoQueryParameter);

    authSession.setAuthNote(CONTEXT_INFO_QUERY_PARAMETER, contextInfoKey);
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
    if (StringUtil.isBlank(formData.getFirst(DATE_OF_BIRTH_FIELD))) {
      errors.put(DATE_OF_BIRTH_FIELD, MISSING_DATE_OF_BIRTH_MESSAGE);
    }
  }

  @Override
  protected boolean validateCredentials(MultivaluedMap<String, String> formData, UserModel user) {
    // Is submitted in the format yyyy-mm-dd from the html input tag with type=date
    String dateOfBirth = formData.getFirst(DATE_OF_BIRTH_FIELD);
    return user.credentialManager()
            .isValid(new UserCredentialModel(null, DateOfBirthCredentialModel.TYPE, dateOfBirth))
        // Todo(ISSUE-7041): Remove. For accounts in prod that still save the date
        // of birth as attribute
        || dateOfBirth.equals(user.getFirstAttribute(KeycloakAttributes.DATE_OF_BIRTH_ATTRIBUTE));
  }

  @Override
  protected String getFormTemplate() {
    return FORM_TEMPLATE;
  }
}
