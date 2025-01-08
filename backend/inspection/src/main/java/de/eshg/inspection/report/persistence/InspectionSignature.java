/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.report.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.inspection.common.persistence.HashAlgorithm;
import de.eshg.inspection.common.persistence.MediaFile;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class InspectionSignature extends BaseEntity {

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String signer;

  @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private MediaFile signatureImage;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String hashValue;

  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private HashAlgorithm hashAlgorithm;

  public String getSigner() {
    return signer;
  }

  public void setSigner(String signer) {
    checkIllegalModification();
    this.signer = signer;
  }

  public MediaFile getSignatureImage() {
    return signatureImage;
  }

  public void setSignatureImage(MediaFile signatureImage) {
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

  private void checkIllegalModification() {
    if (hashValue != null) {
      throw new BadRequestException(
          ErrorCode.DATA_INTEGRITY_VIOLATION,
          "Signature has already been hashed; modification of signature is not allowed");
    }
  }
}
