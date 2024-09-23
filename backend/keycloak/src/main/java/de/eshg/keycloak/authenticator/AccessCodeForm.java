/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.authenticator;

import static org.keycloak.authentication.authenticators.util.AuthenticatorUtils.getDisabledByBruteForceEventError;

import de.eshg.keycloak.api.user.KeycloakAttributes;
import jakarta.ws.rs.core.MultivaluedHashMap;
import jakarta.ws.rs.core.MultivaluedMap;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import org.jboss.logging.Logger;
import org.keycloak.authentication.AbstractFormAuthenticator;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticationFlowError;
import org.keycloak.events.Errors;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.utils.FormMessage;
import org.keycloak.protocol.oidc.OIDCLoginProtocol;
import org.keycloak.sessions.AuthenticationSessionModel;
import org.keycloak.utils.StringUtil;

public class AccessCodeForm extends AbstractFormAuthenticator {

  private static final Logger logger = Logger.getLogger(AccessCodeForm.class);

  public static final String FORM_TEMPLATE = "access-code.ftl";
  public static final String ACCESS_CODE_QUERY_PARAMETER = "access_code";

  public static final String ACCESS_CODE_FIELD = "access_code";
  public static final String DATE_OF_BIRTH_FIELD = "date_of_birth";

  public static final String MISSING_ACCESS_CODE_MESSAGE = "missingAccessCode";
  public static final String MISSING_DATE_OF_BIRTH_MESSAGE = "missingDateOfBirth";
  public static final String INVALID_ACCESS_CODE_CREDENTIALS_MESSAGE =
      "invalidAccessCodeCredentials";
  public static final String ACCOUNT_LOCKED_OUT_MESSAGE = "accountLockedOut";

  @Override
  public void authenticate(AuthenticationFlowContext context) {
    MultivaluedMap<String, String> formData = new MultivaluedHashMap<>();
    MultivaluedMap<String, String> queryParameters = context.getUriInfo().getQueryParameters();
    AuthenticationSessionModel authSession = context.getAuthenticationSession();

    // Only show the authenticator if prompted by query parameter or auth note set
    if (Objects.equals(
            queryParameters.getFirst(OIDCLoginProtocol.PROMPT_PARAM), ACCESS_CODE_QUERY_PARAMETER)
        || Objects.equals(
            authSession.getAuthNote(OIDCLoginProtocol.PROMPT_PARAM), ACCESS_CODE_QUERY_PARAMETER)) {

      authSession.setAuthNote(OIDCLoginProtocol.PROMPT_PARAM, ACCESS_CODE_QUERY_PARAMETER);

      // If an access code was provided in the initial rendering of the page
      // add it to the formData
      if (queryParameters.containsKey(ACCESS_CODE_QUERY_PARAMETER)) {
        String accessCode = queryParameters.getFirst(ACCESS_CODE_QUERY_PARAMETER);
        formData.add(ACCESS_CODE_FIELD, accessCode);
      }
      challenge(context, formData, Map.of());
    } else {
      context.attempted();
    }
  }

  /*
   * This processes the form submission and adds error handling to the same form on failure
   * or delegates to the next authenticators and required actions on success
   */
  @Override
  public void action(AuthenticationFlowContext context) {
    MultivaluedMap<String, String> formData = context.getHttpRequest().getDecodedFormParameters();
    Map<String, String> errors = new HashMap<>();

    String accessCode = formData.getFirst(ACCESS_CODE_FIELD).replaceAll("\\s+", "");
    if (StringUtil.isBlank(accessCode)) {
      errors.put(ACCESS_CODE_FIELD, MISSING_ACCESS_CODE_MESSAGE);
    }
    if (StringUtil.isBlank(formData.getFirst(DATE_OF_BIRTH_FIELD))) {
      errors.put(DATE_OF_BIRTH_FIELD, MISSING_DATE_OF_BIRTH_MESSAGE);
    }

    if (errors.isEmpty()) {
      getUserByAccessCodeAttribute(context, accessCode)
          .ifPresentOrElse(
              user -> {
                // Check if the user is locked out
                String bruteForceError = getDisabledByBruteForceEventError(context, user);
                boolean isDisabled = bruteForceError != null;
                // Is submitted in the format yyyy-mm-dd from the html input tag with type=date
                String dateOfBirth = formData.getFirst(DATE_OF_BIRTH_FIELD);
                if (!isDisabled
                    && dateOfBirth.equals(
                        user.getFirstAttribute(KeycloakAttributes.DATE_OF_BIRTH_ATTRIBUTE))) {
                  context.setUser(user);
                  context.success();
                } else {
                  // So that lockouts can happen
                  logFailedAttemptOnUser(context, user, bruteForceError);
                  // Invalid date of birth
                  formData.remove(ACCESS_CODE_FIELD);
                  if (isDisabled) {
                    errors.put(ACCESS_CODE_FIELD, ACCOUNT_LOCKED_OUT_MESSAGE);
                  } else {
                    errors.put(ACCESS_CODE_FIELD, INVALID_ACCESS_CODE_CREDENTIALS_MESSAGE);
                  }
                }
              },
              () -> {
                // Invalid access code, but display the same error
                formData.remove(ACCESS_CODE_FIELD);
                errors.put(ACCESS_CODE_FIELD, INVALID_ACCESS_CODE_CREDENTIALS_MESSAGE);
              });
    }

    if (!errors.isEmpty()) {
      challenge(context, formData, errors);
    }
  }

  /*
   * This creates the custom code form which asks for an access code and a second authentication information
   * The access code is prefilled if it was previously included in the url and was a valid one where a use lookup was successful
   * Otherwise the use has the opportunity to manually enter an access code.
   * Errors can be set and are displayed at the relevant input fields.
   */
  protected void challenge(
      AuthenticationFlowContext context,
      MultivaluedMap<String, String> formData,
      Map<String, String> errors) {

    LoginFormsProvider form = context.form();
    formData.keySet().stream()
        .filter(name -> StringUtil.isNotBlank(formData.getFirst(name)))
        .forEach(name -> form.setAttribute(name, formData.getFirst(name)));
    errors.forEach((field, message) -> form.addError(new FormMessage(field, message)));
    context.challenge(form.createForm(FORM_TEMPLATE));
  }

  static void logFailedAttemptOnUser(
      AuthenticationFlowContext context, UserModel user, String bruteForceError) {
    context.getEvent().user(user);
    if (bruteForceError != null) {
      context.getEvent().error(bruteForceError);
    } else {
      context.getEvent().error(Errors.INVALID_USER_CREDENTIALS);
    }
    RealmModel realm = context.getRealm();
    if (realm.isBruteForceProtected()) {
      context.getProtector().failedLogin(realm, user, context.getConnection());
    }
  }

  protected Optional<UserModel> getUserByAccessCodeAttribute(
      AuthenticationFlowContext context, String accessCode) {
    try {
      return context
          .getSession()
          .users()
          .searchForUserByUserAttributeStream(
              context.getRealm(), KeycloakAttributes.ACCESS_CODE_ATTRIBUTE, accessCode)
          .reduce(
              (a, b) -> {
                throw new RuntimeException("Too many users found for access code");
              });
    } catch (RuntimeException ex) {
      logger.error(ex.getMessage(), ex);
      context.failure(AuthenticationFlowError.GENERIC_AUTHENTICATION_ERROR);
    }
    return Optional.empty();
  }

  @Override
  public boolean requiresUser() {
    return false;
  }

  @Override
  public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
    return false;
  }

  @Override
  public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) {}
}
