/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import java.time.Instant;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class EncryptedPersonalData extends BaseEntity {

  private byte[] encryptedData;
  private byte[] nonce;

  private byte[] hashedPersonIdentifier;

  private Instant lastConsultationDate;

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

  public Instant getLastConsultationDate() {
    return lastConsultationDate;
  }

  public void setLastConsultationDate(Instant lastConsultationDate) {
    this.lastConsultationDate = lastConsultationDate;
  }
}
