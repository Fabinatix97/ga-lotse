/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(indexes = @Index(columnList = "gdpr_procedure_id"))
public class CentralFileIdWrapper extends BaseEntity {

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID centralFileId;

  public UUID getCentralFileId() {
    return centralFileId;
  }

  public void setCentralFileId(UUID centralFileId) {
    this.centralFileId = centralFileId;
  }

  @ManyToOne(optional = false)
  @JoinColumn(name = "gdpr_procedure_id")
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OrderBy
  private GdprProcedure gdprProcedure;

  public void setGdprProcedure(GdprProcedure gdprProcedure) {
    this.gdprProcedure = gdprProcedure;
  }
}
