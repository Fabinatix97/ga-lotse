/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.credentialprovider;

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
import org.keycloak.models.PasswordPolicy;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.credential.PasswordCredentialModel;

public class DateOfBirthCredentialProvider
    implements CredentialProvider<DateOfBirthCredentialModel>,
        CredentialInputUpdater,
        CredentialInputValidator {

  protected final KeycloakSession session;

  public DateOfBirthCredentialProvider(KeycloakSession session) {
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
        .map(DateOfBirthCredentialModel::createFromCredentialModel)
        .map(
            dateOfBirthCredentialModel -> {
              PasswordHashProvider hashProvider =
                  session.getProvider(
                      PasswordHashProvider.class,
                      dateOfBirthCredentialModel.getDateOfBirthCredentialData().getAlgorithm());
              PasswordCredentialModel dateOfBirthAsPasswordModel =
                  PasswordCredentialModel.createFromCredentialModel(dateOfBirthCredentialModel);
              return hashProvider.verify(
                  credentialInput.getChallengeResponse(), dateOfBirthAsPasswordModel);
            })
        .orElse(false);
  }

  @Override
  public boolean updateCredential(RealmModel realm, UserModel user, CredentialInput input) {
    PasswordPolicy policy = realm.getPasswordPolicy();
    PasswordHashProvider hashProvider =
        policy.getHashAlgorithm() != null
            ? session.getProvider(PasswordHashProvider.class, policy.getHashAlgorithm())
            : session.getProvider(PasswordHashProvider.class);
    PasswordCredentialModel credentialModel =
        hashProvider.encodedCredential(input.getChallengeResponse(), policy.getHashIterations());
    DateOfBirthCredentialModel dateOfBirthCredentialModel =
        DateOfBirthCredentialModel.createFromPasswordCredentialModel(credentialModel);
    dateOfBirthCredentialModel.setCreatedDate(Time.currentTimeMillis());
    createCredential(realm, user, dateOfBirthCredentialModel);
    return true;
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
    return DateOfBirthCredentialModel.TYPE;
  }

  @Override
  public CredentialModel createCredential(
      RealmModel realm, UserModel user, DateOfBirthCredentialModel credentialModel) {
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
  public DateOfBirthCredentialModel getCredentialFromModel(CredentialModel model) {
    return DateOfBirthCredentialModel.createFromCredentialModel(model);
  }

  @Override
  public CredentialTypeMetadata getCredentialTypeMetadata(
      CredentialTypeMetadataContext metadataContext) {
    return CredentialTypeMetadata.builder()
        .type(getType())
        .category(CredentialTypeMetadata.Category.BASIC_AUTHENTICATION)
        .displayName("date-of-birth-display-name")
        .helpText("date-of-birth-help-text")
        .iconCssClass("kcAuthenticatorPasswordClass")
        .removeable(true)
        .build(session);
  }
}
