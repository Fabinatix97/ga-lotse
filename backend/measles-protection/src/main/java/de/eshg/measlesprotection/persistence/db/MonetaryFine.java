/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(indexes = @Index(columnList = "procedure_id"))
public class MonetaryFine extends BaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "procedure_id")
  private MeaslesProtectionProcedure procedure;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  private LocalDate fineIssuedDate;

  public void setProcedure(MeaslesProtectionProcedure procedure) {
    this.procedure = procedure;
  }

  public LocalDate getFineIssuedDate() {
    return fineIssuedDate;
  }

  public void setFineIssuedDate(LocalDate fineIssuedDate) {
    this.fineIssuedDate = fineIssuedDate;
  }
}
