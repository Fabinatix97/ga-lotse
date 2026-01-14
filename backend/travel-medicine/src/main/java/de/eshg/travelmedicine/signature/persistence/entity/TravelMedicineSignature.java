/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.signature.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.travelmedicine.signature.HashAlgorithm;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class TravelMedicineSignature extends GloballyUniqueEntityBase {
  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String signer;

  @Lob
  @Column
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private byte[] signatureImage;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String hashValue;

  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private HashAlgorithm hashAlgorithm;

  @Column
  @NotNull
  @CreatedDate
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Instant createdAt;

  public TravelMedicineSignature(String signer, @NotNull byte[] signatureImage) {
    this.signer = signer;
    this.signatureImage = signatureImage;
  }

  public TravelMedicineSignature() {}

  public String getSigner() {
    return signer;
  }

  public void setSigner(String signer) {
    checkIllegalModification();
    this.signer = signer;
  }

  public byte[] getSignatureImage() {
    return signatureImage;
  }

  public void setSignatureImage(byte[] signatureImage) {
    checkIllegalModification();
    this.signatureImage = signatureImage;
  }

  public String getHashValue() {
    return hashValue;
  }

  public void setHashValue(String hashValue) {
    checkIllegalModification();
    this.hashValue = hashValue;
  }

  public HashAlgorithm getHashAlgorithm() {
    return hashAlgorithm;
  }

  public void setHashAlgorithm(HashAlgorithm hashAlgorithm) {
    checkIllegalModification();
    this.hashAlgorithm = hashAlgorithm;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  private void checkIllegalModification() {
    if (hashValue != null) {
      throw new BadRequestException(
          ErrorCode.DATA_INTEGRITY_VIOLATION,
          "Signature has already been hashed; modification of signature is not allowed");
    }
  }
}
