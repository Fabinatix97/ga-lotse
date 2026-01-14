/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.credentialprovider;

import java.io.Serial;
import org.keycloak.credential.CredentialModel;
import org.keycloak.models.credential.PasswordCredentialModel;
import org.keycloak.models.credential.dto.PasswordCredentialData;
import org.keycloak.models.credential.dto.PasswordSecretData;

public class DateOfBirthCredentialModel extends CredentialModel {

  @Serial private static final long serialVersionUID = 1L;

  public static final String TYPE = "date-of-birth";

  private final transient PasswordCredentialData credentialData;
  private final transient PasswordSecretData secretData;

  private DateOfBirthCredentialModel(
      PasswordCredentialData credentialData, PasswordSecretData secretData) {
    this.credentialData = credentialData;
    this.secretData = secretData;
  }

  public static DateOfBirthCredentialModel createFromCredentialModel(
      CredentialModel credentialModel) {
    return createFromPasswordCredentialModel(
        PasswordCredentialModel.createFromCredentialModel(credentialModel));
  }

  public static DateOfBirthCredentialModel createFromPasswordCredentialModel(
      PasswordCredentialModel credentialModel) {
    DateOfBirthCredentialModel dateOfBirthCredentialModel =
        new DateOfBirthCredentialModel(
            credentialModel.getPasswordCredentialData(), credentialModel.getPasswordSecretData());
    dateOfBirthCredentialModel.setCreatedDate(credentialModel.getCreatedDate());
    dateOfBirthCredentialModel.setId(credentialModel.getId());
    dateOfBirthCredentialModel.setType(TYPE);
    dateOfBirthCredentialModel.setUserLabel(credentialModel.getUserLabel());
    dateOfBirthCredentialModel.setSecretData(credentialModel.getSecretData());
    dateOfBirthCredentialModel.setCredentialData(credentialModel.getCredentialData());
    return dateOfBirthCredentialModel;
  }

  public PasswordCredentialData getDateOfBirthCredentialData() {
    return credentialData;
  }

  public PasswordSecretData getDateOfBirthSecretData() {
    return secretData;
  }
}
