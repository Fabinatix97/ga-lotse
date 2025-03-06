/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
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

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DentitionType dentitionType;

  private boolean plaque;

  private boolean calculus;

  private boolean gingivitis;

  private boolean parodontitis;

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

  public DentitionType getDentitionType() {
    return dentitionType;
  }

  public void setDentitionType(DentitionType dentitionType) {
    this.dentitionType = dentitionType;
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

  public boolean hasPlaque() {
    return plaque;
  }

  public void setPlaque(boolean plaque) {
    this.plaque = plaque;
  }

  public boolean hasCalculus() {
    return calculus;
  }

  public void setCalculus(boolean calculus) {
    this.calculus = calculus;
  }

  public boolean hasGingivitis() {
    return gingivitis;
  }

  public void setGingivitis(boolean gingivitis) {
    this.gingivitis = gingivitis;
  }

  public boolean hasParodontitis() {
    return parodontitis;
  }

  public void setParodontitis(boolean parodontitis) {
    this.parodontitis = parodontitis;
  }
}
