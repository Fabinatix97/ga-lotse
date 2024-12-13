/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.credentialprovider;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;
import org.keycloak.common.util.Time;
import org.keycloak.credential.CredentialInput;
import org.keycloak.credential.CredentialInputUpdater;
import org.keycloak.credential.CredentialInputValidator;
import org.keycloak.credential.CredentialModel;
import org.keycloak.credential.CredentialProvider;
import org.keycloak.credential.CredentialTypeMetadata;
import org.keycloak.credential.CredentialTypeMetadataContext;
import org.keycloak.credential.hash.PasswordHashProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.ModelException;
import org.keycloak.models.PasswordPolicy;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.credential.PasswordCredentialModel;

public class PinCredentialProvider
    implements CredentialProvider<PinCredentialModel>,
        CredentialInputUpdater,
        CredentialInputValidator {

  protected final KeycloakSession session;

  public PinCredentialProvider(KeycloakSession session) {
    this.session = session;
  }

  @Override
  public boolean supportsCredentialType(String credentialType) {
    return credentialType.equals(getType());
  }

  @Override
  public boolean isConfiguredFor(RealmModel realm, UserModel user, String credentialType) {
    return user.credentialManager()
        .getStoredCredentialsByTypeStream(getType())
        .findAny()
        .isPresent();
  }

  @Override
  public boolean isValid(RealmModel realm, UserModel user, CredentialInput credentialInput) {
    return user.credentialManager()
        .getStoredCredentialsByTypeStream(getType())
        .findFirst()
        .map(PinCredentialModel::createFromCredentialModel)
        .map(
            pin -> {
              PasswordHashProvider hashProvider =
                  session.getProvider(
                      PasswordHashProvider.class, pin.getPinCredentialData().getAlgorithm());
              PasswordCredentialModel pinAsPasswordModel =
                  PasswordCredentialModel.createFromCredentialModel(pin);
              return hashProvider.verify(
                  credentialInput.getChallengeResponse(), pinAsPasswordModel);
            })
        .orElse(false);
  }

  @Override
  public boolean updateCredential(RealmModel realm, UserModel user, CredentialInput input) {
    validate(input.getChallengeResponse());
    PasswordPolicy policy = realm.getPasswordPolicy();
    PasswordHashProvider hashProvider =
        policy.getHashAlgorithm() != null
            ? session.getProvider(PasswordHashProvider.class, policy.getHashAlgorithm())
            : session.getProvider(PasswordHashProvider.class);
    PasswordCredentialModel credentialModel =
        hashProvider.encodedCredential(input.getChallengeResponse(), policy.getHashIterations());
    PinCredentialModel pinCredentialModel =
        PinCredentialModel.createFromPasswordCredentialModel(credentialModel);
    pinCredentialModel.setCreatedDate(Time.currentTimeMillis());
    createCredential(realm, user, pinCredentialModel);
    return true;
  }

  private void validate(String pin) {
    Pattern pattern = Pattern.compile("^\\d{6}$");
    Matcher matcher = pattern.matcher(pin);
    if (!matcher.matches()) {
      throw new ModelException("PIN does not match defined pattern", pattern.pattern());
    }
  }

  @Override
  public void disableCredentialType(RealmModel realm, UserModel user, String credentialType) {
    // we do not support disabling this credential type
  }

  @Override
  public Stream<String> getDisableableCredentialTypesStream(RealmModel realm, UserModel user) {
    return Stream.empty();
  }

  @Override
  public String getType() {
    return PinCredentialModel.TYPE;
  }

  @Override
  public CredentialModel createCredential(
      RealmModel realm, UserModel user, PinCredentialModel credentialModel) {
    user.credentialManager()
        .getStoredCredentialsByTypeStream(getType())
        .forEach(c -> user.credentialManager().removeStoredCredentialById(c.getId()));
    return user.credentialManager().createStoredCredential(credentialModel);
  }

  @Override
  public boolean deleteCredential(RealmModel realm, UserModel user, String credentialId) {
    return user.credentialManager().removeStoredCredentialById(credentialId);
  }

  @Override
  public PinCredentialModel getCredentialFromModel(CredentialModel model) {
    return PinCredentialModel.createFromCredentialModel(model);
  }

  @Override
  public CredentialTypeMetadata getCredentialTypeMetadata(
      CredentialTypeMetadataContext metadataContext) {
    return CredentialTypeMetadata.builder()
        .type(getType())
        .category(CredentialTypeMetadata.Category.BASIC_AUTHENTICATION)
        .displayName("pin-display-name")
        .helpText("pin-help-text")
        .iconCssClass("kcAuthenticatorPasswordClass")
        .removeable(true)
        .build(session);
  }
}
