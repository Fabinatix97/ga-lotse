/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;

@Entity
public class RapidTestExamination extends GenericEntity<Long> {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Id
  private Long id;

  @MapsId
  @OneToOne(optional = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private StiProtectionProcedure procedure;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String generalComments;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private Boolean testsPayed;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private Boolean hivRequested;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private Boolean syphilisRequested;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private Boolean pregnancyTestRequested;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private Boolean ultrasoundRequested;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private Boolean bloodPressureRequested;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private Boolean pulseRequested;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private Boolean urinalysisRequested;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @AttributeOverrides({
    @AttributeOverride(name = "number", column = @Column(name = "hiv_number")),
    @AttributeOverride(name = "result", column = @Column(name = "hiv_result")),
  })
  @Embedded
  private RapidTestData hivData;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @AttributeOverrides({
    @AttributeOverride(name = "number", column = @Column(name = "syphilis_number")),
    @AttributeOverride(name = "result", column = @Column(name = "syphilis_result")),
  })
  @Embedded
  private RapidTestData syphilisData;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @AttributeOverrides({
    @AttributeOverride(name = "number", column = @Column(name = "pregnancy_test_number")),
    @AttributeOverride(name = "result", column = @Column(name = "pregnancy_test_result")),
  })
  @Embedded
  private RapidTestData pregnancyTestData;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String ultrasoundData;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String bloodPressureData;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String pulseData;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String urinalysisData;

  @Override
  public Long getId() {
    return id;
  }

  public StiProtectionProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(StiProtectionProcedure procedure) {
    this.procedure = procedure;
  }

  public String getGeneralComments() {
    return generalComments;
  }

  public void setGeneralComments(String generalComments) {
    this.generalComments = generalComments;
  }

  public Boolean getTestsPayed() {
    return testsPayed;
  }

  public void setTestsPayed(Boolean testsPayed) {
    this.testsPayed = testsPayed;
  }

  public Boolean isHivRequested() {
    return hivRequested;
  }

  public void setHivRequested(Boolean hivRequested) {
    this.hivRequested = hivRequested;
    if (Boolean.FALSE.equals(hivRequested)) {
      this.hivData = null;
    }
  }

  public Boolean isSyphilisRequested() {
    return syphilisRequested;
  }

  public void setSyphilisRequested(Boolean syphilisRequested) {
    this.syphilisRequested = syphilisRequested;
    if (Boolean.FALSE.equals(syphilisRequested)) {
      this.syphilisData = null;
    }
  }

  public Boolean isPregnancyTestRequested() {
    return pregnancyTestRequested;
  }

  public void setPregnancyTestRequested(Boolean pregnancyTestRequested) {
    this.pregnancyTestRequested = pregnancyTestRequested;
    if (Boolean.FALSE.equals(pregnancyTestRequested)) {
      this.pregnancyTestData = null;
    }
  }

  public Boolean isUltrasoundRequested() {
    return ultrasoundRequested;
  }

  public void setUltrasoundRequested(Boolean ultrasoundRequested) {
    this.ultrasoundRequested = ultrasoundRequested;
    if (Boolean.FALSE.equals(ultrasoundRequested)) {
      this.ultrasoundData = null;
    }
  }

  public Boolean isBloodPressureRequested() {
    return bloodPressureRequested;
  }

  public void setBloodPressureRequested(Boolean bloodPressureRequested) {
    this.bloodPressureRequested = bloodPressureRequested;
    if (Boolean.FALSE.equals(bloodPressureRequested)) {
      this.bloodPressureData = null;
    }
  }

  public Boolean isPulseRequested() {
    return pulseRequested;
  }

  public void setPulseRequested(Boolean pulseRequested) {
    this.pulseRequested = pulseRequested;
    if (Boolean.FALSE.equals(pulseRequested)) {
      this.pulseData = null;
    }
  }

  public Boolean isUrinalysisRequested() {
    return urinalysisRequested;
  }

  public void setUrinalysisRequested(Boolean urinalysisRequested) {
    this.urinalysisRequested = urinalysisRequested;
    if (Boolean.FALSE.equals(urinalysisRequested)) {
      this.urinalysisData = null;
    }
  }

  public RapidTestData getHivData() {
    return hivData;
  }

  public void setHivData(RapidTestData hivData) {
    this.hivData = hivData;
  }

  public RapidTestData getSyphilisData() {
    return syphilisData;
  }

  public void setSyphilisData(RapidTestData syphilisData) {
    this.syphilisData = syphilisData;
  }

  public RapidTestData getPregnancyTestData() {
    return pregnancyTestData;
  }

  public void setPregnancyTestData(RapidTestData pregnancyTestData) {
    this.pregnancyTestData = pregnancyTestData;
  }

  public String getUltrasoundData() {
    return ultrasoundData;
  }

  public void setUltrasoundData(String ultrasoundData) {
    this.ultrasoundData = ultrasoundData;
  }

  public String getBloodPressureData() {
    return bloodPressureData;
  }

  public void setBloodPressureData(String bloodPressureData) {
    this.bloodPressureData = bloodPressureData;
  }

  public String getPulseData() {
    return pulseData;
  }

  public void setPulseData(String pulseData) {
    this.pulseData = pulseData;
  }

  public String getUrinalysisData() {
    return urinalysisData;
  }

  public void setUrinalysisData(String urinalysisData) {
    this.urinalysisData = urinalysisData;
  }
}
