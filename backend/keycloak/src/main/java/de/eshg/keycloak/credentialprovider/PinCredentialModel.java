/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.keycloak.credentialprovider;

import java.io.Serial;
import org.keycloak.credential.CredentialModel;
import org.keycloak.models.credential.PasswordCredentialModel;
import org.keycloak.models.credential.dto.PasswordCredentialData;
import org.keycloak.models.credential.dto.PasswordSecretData;

public class PinCredentialModel extends CredentialModel {

  @Serial private static final long serialVersionUID = 1L;

  public static final String TYPE = "pin";

  private final transient PasswordCredentialData credentialData;
  private final transient PasswordSecretData secretData;

  private PinCredentialModel(PasswordCredentialData credentialData, PasswordSecretData secretData) {
    this.credentialData = credentialData;
    this.secretData = secretData;
  }

  public static PinCredentialModel createFromCredentialModel(CredentialModel credentialModel) {
    return createFromPasswordCredentialModel(
        PasswordCredentialModel.createFromCredentialModel(credentialModel));
  }

  public static PinCredentialModel createFromPasswordCredentialModel(
      PasswordCredentialModel credentialModel) {
    PinCredentialModel pinCredentialModel =
        new PinCredentialModel(
            credentialModel.getPasswordCredentialData(), credentialModel.getPasswordSecretData());
    pinCredentialModel.setCreatedDate(credentialModel.getCreatedDate());
    pinCredentialModel.setId(credentialModel.getId());
    pinCredentialModel.setType(TYPE);
    pinCredentialModel.setUserLabel(credentialModel.getUserLabel());
    pinCredentialModel.setSecretData(credentialModel.getSecretData());
    pinCredentialModel.setCredentialData(credentialModel.getCredentialData());
    return pinCredentialModel;
  }

  public PasswordCredentialData getPinCredentialData() {
    return credentialData;
  }

  public PasswordSecretData getPinSecretData() {
    return secretData;
  }
}
