/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import java.util.List;
import java.util.Map;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.MapKeyJdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
@DiscriminatorValue("SCREENING")
public class ScreeningExaminationResult extends ExaminationResult {

  private Integer childAge;

  private Boolean fluorideVarnishApplied;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private OralHygieneStatus oralHygieneStatus;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private MihStatus mihStatus;

  @ElementCollection
  @Enumerated(EnumType.STRING)
  @OrderColumn
  @BatchSize(size = 100)
  private List<OrthodonticFinding> orthodonticFindings;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private OrthodonticStatus orthodonticStatus;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DentitionType dentitionType;

  private boolean plaque;

  private boolean calculus;

  private boolean gingivitis;

  private boolean parodontitis;

  private boolean blackStain;

  private Boolean decayRisk;

  private boolean individualProphylaxis;

  private boolean fissureSealing;

  private boolean tartarRemoval;

  private boolean gingivitisTreatment;

  private boolean orthodonticTreatment;

  private boolean plaqueTreatment;

  private boolean inspectionAppointment;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private DecayStatus decayStatus;

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

  public Integer getChildAge() {
    return childAge;
  }

  public void setChildAge(Integer childAgeAtExamination) {
    this.childAge = childAgeAtExamination;
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

  public boolean hasBlackStain() {
    return blackStain;
  }

  public void setBlackStain(boolean blackStain) {
    this.blackStain = blackStain;
  }

  public MihStatus getMihStatus() {
    return mihStatus;
  }

  public void setMihStatus(MihStatus mihStatus) {
    this.mihStatus = mihStatus;
  }

  public List<OrthodonticFinding> getOrthodonticFindings() {
    return orthodonticFindings;
  }

  public void setOrthodonticFindings(List<OrthodonticFinding> orthodonticFindings) {
    this.orthodonticFindings = orthodonticFindings;
  }

  public OrthodonticStatus getOrthodonticStatus() {
    return orthodonticStatus;
  }

  public void setOrthodonticStatus(OrthodonticStatus orthodonticStatus) {
    this.orthodonticStatus = orthodonticStatus;
  }

  public Boolean getDecayRisk() {
    return decayRisk;
  }

  public void setDecayRisk(Boolean decayRisk) {
    this.decayRisk = decayRisk;
  }

  public DecayStatus getDecayStatus() {
    return decayStatus;
  }

  public void setDecayStatus(DecayStatus decayStatus) {
    this.decayStatus = decayStatus;
  }

  public boolean isIndividualProphylaxis() {
    return individualProphylaxis;
  }

  public void setIndividualProphylaxis(boolean individualProphylaxis) {
    this.individualProphylaxis = individualProphylaxis;
  }

  public boolean isFissureSealing() {
    return fissureSealing;
  }

  public void setFissureSealing(boolean fissureSealing) {
    this.fissureSealing = fissureSealing;
  }

  public boolean isTartarRemoval() {
    return tartarRemoval;
  }

  public void setTartarRemoval(boolean tartarRemoval) {
    this.tartarRemoval = tartarRemoval;
  }

  public boolean isGingivitisTreatment() {
    return gingivitisTreatment;
  }

  public void setGingivitisTreatment(boolean gingivitisTreatment) {
    this.gingivitisTreatment = gingivitisTreatment;
  }

  public boolean isOrthodonticTreatment() {
    return orthodonticTreatment;
  }

  public void setOrthodonticTreatment(boolean orthodonticTreatment) {
    this.orthodonticTreatment = orthodonticTreatment;
  }

  public boolean isPlaqueTreatment() {
    return plaqueTreatment;
  }

  public void setPlaqueTreatment(boolean plaqueTreatment) {
    this.plaqueTreatment = plaqueTreatment;
  }

  public boolean isInspectionAppointment() {
    return inspectionAppointment;
  }

  public void setInspectionAppointment(boolean inspectionAppointment) {
    this.inspectionAppointment = inspectionAppointment;
  }
}
