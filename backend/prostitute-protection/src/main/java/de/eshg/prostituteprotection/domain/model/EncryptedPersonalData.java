/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class EncryptedPersonalData extends BaseEntity {

  private byte[] encryptedData;
  private byte[] nonce;

  private byte[] hashedPersonIdentifier;

  public byte[] getEncryptedData() {
    return encryptedData;
  }

  public void setEncryptedData(byte[] encryptedData) {
    this.encryptedData = encryptedData;
  }

  public byte[] getNonce() {
    return nonce;
  }

  public void setNonce(byte[] nonce) {
    this.nonce = nonce;
  }

  public byte[] getHashedPersonIdentifier() {
    return hashedPersonIdentifier;
  }

  public void setHashedPersonIdentifier(byte[] hashedPersonIdentifier) {
    this.hashedPersonIdentifier = hashedPersonIdentifier;
  }
}
