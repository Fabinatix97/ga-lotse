/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.OrderBy;
import java.util.Map;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.MapKeyJdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
@DiscriminatorValue("SCREENING")
public class ScreeningExaminationResult extends ExaminationResult {

  private Boolean fluorideVarnishApplied;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private OralHygieneStatus oralHygieneStatus;

  @ElementCollection
  @MapKeyJdbcType(PostgreSQLEnumJdbcType.class)
  @MapKeyColumn(name = "tooth")
  @OrderBy("tooth")
  @BatchSize(size = 100)
  private Map<Tooth, ToothDiagnosis> toothDiagnoses;

  public OralHygieneStatus getOralHygieneStatus() {
    return oralHygieneStatus;
  }

  public void setOralHygieneStatus(OralHygieneStatus oralHygieneStatus) {
    this.oralHygieneStatus = oralHygieneStatus;
  }

  public Map<Tooth, ToothDiagnosis> getToothDiagnoses() {
    return toothDiagnoses;
  }

  public void setToothDiagnoses(Map<Tooth, ToothDiagnosis> toothDiagnoses) {
    this.toothDiagnoses = toothDiagnoses;
  }

  public Boolean isFluorideVarnishApplied() {
    return fluorideVarnishApplied;
  }

  public void setFluorideVarnishApplied(Boolean fluorideVarnishApplied) {
    this.fluorideVarnishApplied = fluorideVarnishApplied;
  }
}
