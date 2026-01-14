/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.model;

import static de.eshg.prostituteprotection.domain.model.EncryptedFile.PROCEDURE_ID;

import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
@Table(indexes = @Index(columnList = PROCEDURE_ID))
public class EncryptedFile extends SequencedBaseEntityWithExternalId {

  static final String PROCEDURE_ID = "procedure_id";

  private byte[] encryptedData;
  private byte[] nonce;

  private Boolean withAlias;

  @Column(nullable = false)
  private Instant createdAt;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private CertificateType certificateType;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = PROCEDURE_ID)
  private ProstituteProtectionProcedure procedure;

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

  public Boolean getWithAlias() {
    return withAlias;
  }

  public void setWithAlias(Boolean withAlias) {
    this.withAlias = withAlias;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public CertificateType getCertificateType() {
    return certificateType;
  }

  public void setCertificateType(CertificateType certificateType) {
    this.certificateType = certificateType;
  }

  public ProstituteProtectionProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(ProstituteProtectionProcedure procedure) {
    this.procedure = procedure;
  }
}
