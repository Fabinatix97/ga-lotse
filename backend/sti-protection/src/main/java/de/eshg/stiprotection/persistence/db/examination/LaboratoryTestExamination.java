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
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class LaboratoryTestExamination extends GenericEntity<Long> {

  @Id private Long id;

  @MapsId
  @OneToOne(optional = false)
  private StiProtectionProcedure procedure;

  // General
  private String sampleBarCode;
  private String generalRemarks;
  private Boolean testsConducted;
  private Boolean testsPayed;

  // Tests
  private Boolean hivRequested;
  private Boolean syphilisRequested;
  private Boolean hepARequested;
  private Boolean hepBRequested;
  private Boolean hepCRequested;
  private Boolean chlamydiaRequested;
  private Boolean gonorrheaRequested;
  private Boolean mycoplasmaRequested;
  private Boolean cancerScreeningRequested;
  private Boolean hpvRequested;
  private Boolean mpoxRequested;
  private Boolean otherTestRequested;

  @AttributeOverride(name = "result", column = @Column(name = "hiv_result"))
  @AttributeOverride(name = "value", column = @Column(name = "hiv_value"))
  @AttributeOverride(name = "remark", column = @Column(name = "hiv_remark"))
  @Embedded
  private LaboratoryTestData hivData;

  @AttributeOverride(name = "result", column = @Column(name = "syphilis_result"))
  @AttributeOverride(name = "value", column = @Column(name = "syphilis_value"))
  @AttributeOverride(name = "remark", column = @Column(name = "syphilis_remark"))
  @Embedded
  private LaboratoryTestData syphilisData;

  private Boolean hadSyphilis;

  @AttributeOverride(name = "infection", column = @Column(name = "hepA_infection"))
  @AttributeOverride(name = "vaccineTitre", column = @Column(name = "hepA_vaccine_titre"))
  @AttributeOverride(name = "value", column = @Column(name = "hepA_value"))
  @AttributeOverride(name = "remark", column = @Column(name = "hepA_remark"))
  @Embedded
  private HepatitisLaboratoryTestData hepAData;

  @AttributeOverride(name = "infection", column = @Column(name = "hepB_infection"))
  @AttributeOverride(name = "vaccineTitre", column = @Column(name = "hepB_vaccine_titre"))
  @AttributeOverride(name = "value", column = @Column(name = "hepB_value"))
  @AttributeOverride(name = "remark", column = @Column(name = "hepB_remark"))
  @Embedded
  private HepatitisLaboratoryTestData hepBData;

  @AttributeOverride(name = "result", column = @Column(name = "hepC_result"))
  @AttributeOverride(name = "value", column = @Column(name = "hepC_value"))
  @AttributeOverride(name = "remark", column = @Column(name = "hepC_remark"))
  @Embedded
  private LaboratoryTestData hepCData;

  @AttributeOverride(
      name = "oralSampleRequested",
      column = @Column(name = "gonorrhea_oral_sample_requested"))
  @AttributeOverride(name = "oralSampleData", column = @Column(name = "gonorrhea_oral_sample_data"))
  @AttributeOverride(
      name = "oralSampleData.result",
      column = @Column(name = "gonorrhea_oral_sample_data_result"))
  @AttributeOverride(
      name = "oralSampleData.value",
      column = @Column(name = "gonorrhea_oral_sample_data_value"))
  @AttributeOverride(
      name = "oralSampleData.remark",
      column = @Column(name = "gonorrhea_oral_sample_data_remark"))
  @AttributeOverride(
      name = "urethralSampleRequested",
      column = @Column(name = "gonorrhea_urethral_sample_requested"))
  @AttributeOverride(
      name = "urethralSampleData",
      column = @Column(name = "gonorrhea_urethral_sample_data"))
  @AttributeOverride(
      name = "urethralSampleData.result",
      column = @Column(name = "gonorrhea_urethral_sample_data_result"))
  @AttributeOverride(
      name = "urethralSampleData.value",
      column = @Column(name = "gonorrhea_urethral_sample_data_value"))
  @AttributeOverride(
      name = "urethralSampleData.remark",
      column = @Column(name = "gonorrhea_urethral_sample_data_remark"))
  @AttributeOverride(
      name = "analSampleRequested",
      column = @Column(name = "gonorrhea_anal_sample_requested"))
  @AttributeOverride(name = "analSampleData", column = @Column(name = "gonorrhea_anal_sample_data"))
  @AttributeOverride(
      name = "analSampleData.result",
      column = @Column(name = "gonorrhea_anal_sample_data_result"))
  @AttributeOverride(
      name = "analSampleData.value",
      column = @Column(name = "gonorrhea_anal_sample_data_value"))
  @AttributeOverride(
      name = "analSampleData.remark",
      column = @Column(name = "gonorrhea_anal_sample_data_remark"))
  @Embedded
  private LaboratoryTestSamplesData gonorrheaTestSamples;

  @AttributeOverride(
      name = "oralSampleRequested",
      column = @Column(name = "chlamydia_oral_sample_requested"))
  @AttributeOverride(name = "oralSampleData", column = @Column(name = "chlamydia_oral_sample_data"))
  @AttributeOverride(
      name = "oralSampleData.result",
      column = @Column(name = "chlamydia_oral_sample_data_result"))
  @AttributeOverride(
      name = "oralSampleData.value",
      column = @Column(name = "chlamydia_oral_sample_data_value"))
  @AttributeOverride(
      name = "oralSampleData.remark",
      column = @Column(name = "chlamydia_oral_sample_data_remark"))
  @AttributeOverride(
      name = "urethralSampleRequested",
      column = @Column(name = "chlamydia_urethral_sample_requested"))
  @AttributeOverride(
      name = "urethralSampleData",
      column = @Column(name = "chlamydia_urethral_sample_data"))
  @AttributeOverride(
      name = "urethralSampleData.result",
      column = @Column(name = "chlamydia_urethral_sample_data_result"))
  @AttributeOverride(
      name = "urethralSampleData.value",
      column = @Column(name = "chlamydia_urethral_sample_data_value"))
  @AttributeOverride(
      name = "urethralSampleData.remark",
      column = @Column(name = "chlamydia_urethral_sample_data_remark"))
  @AttributeOverride(
      name = "analSampleRequested",
      column = @Column(name = "chlamydia_anal_sample_requested"))
  @AttributeOverride(name = "analSampleData", column = @Column(name = "chlamydia_anal_sample_data"))
  @AttributeOverride(
      name = "analSampleData.result",
      column = @Column(name = "chlamydia_anal_sample_data_result"))
  @AttributeOverride(
      name = "analSampleData.value",
      column = @Column(name = "chlamydia_anal_sample_data_value"))
  @AttributeOverride(
      name = "analSampleData.remark",
      column = @Column(name = "chlamydia_anal_sample_data_remark"))
  @Embedded
  private LaboratoryTestSamplesData chlamydiaTestSamples;

  @AttributeOverride(
      name = "oralSampleRequested",
      column = @Column(name = "mycoplasma_oral_sample_requested"))
  @AttributeOverride(
      name = "oralSampleData",
      column = @Column(name = "mycoplasma_oral_sample_data"))
  @AttributeOverride(
      name = "oralSampleData.result",
      column = @Column(name = "mycoplasma_oral_sample_data_result"))
  @AttributeOverride(
      name = "oralSampleData.value",
      column = @Column(name = "mycoplasma_oral_sample_data_value"))
  @AttributeOverride(
      name = "oralSampleData.remark",
      column = @Column(name = "mycoplasma_oral_sample_data_remark"))
  @AttributeOverride(
      name = "urethralSampleRequested",
      column = @Column(name = "mycoplasma_urethral_sample_requested"))
  @AttributeOverride(
      name = "urethralSampleData",
      column = @Column(name = "mycoplasma_urethral_sample_data"))
  @AttributeOverride(
      name = "urethralSampleData.result",
      column = @Column(name = "mycoplasma_urethral_sample_data_result"))
  @AttributeOverride(
      name = "urethralSampleData.value",
      column = @Column(name = "mycoplasma_urethral_sample_data_value"))
  @AttributeOverride(
      name = "urethralSampleData.remark",
      column = @Column(name = "mycoplasma_urethral_sample_data_remark"))
  @AttributeOverride(
      name = "analSampleRequested",
      column = @Column(name = "mycoplasma_anal_sample_requested"))
  @AttributeOverride(
      name = "analSampleData",
      column = @Column(name = "mycoplasma_anal_sample_data"))
  @AttributeOverride(
      name = "analSampleData.result",
      column = @Column(name = "mycoplasma_anal_sample_data_result"))
  @AttributeOverride(
      name = "analSampleData.value",
      column = @Column(name = "mycoplasma_anal_sample_data_value"))
  @AttributeOverride(
      name = "analSampleData.remark",
      column = @Column(name = "mycoplasma_anal_sample_data_remark"))
  @Embedded
  private LaboratoryTestSamplesData mycoplasmaTestSamples;

  @AttributeOverride(name = "result", column = @Column(name = "cancerScreening_result"))
  @AttributeOverride(name = "value", column = @Column(name = "cancerScreening_value"))
  @AttributeOverride(name = "remark", column = @Column(name = "cancerScreening_remark"))
  @Embedded
  private LaboratoryTestData cancerScreeningData;

  @AttributeOverride(name = "result", column = @Column(name = "hpv_result"))
  @AttributeOverride(name = "value", column = @Column(name = "hpv_value"))
  @AttributeOverride(name = "remark", column = @Column(name = "hpv_remark"))
  @Embedded
  private LaboratoryTestData hpvData;

  @AttributeOverride(name = "result", column = @Column(name = "mpox_result"))
  @AttributeOverride(name = "value", column = @Column(name = "mpox_value"))
  @AttributeOverride(name = "remark", column = @Column(name = "mpox_remark"))
  @Embedded
  private LaboratoryTestData mpoxData;

  private String otherTestName;

  @AttributeOverride(name = "result", column = @Column(name = "otherTest_result"))
  @AttributeOverride(name = "value", column = @Column(name = "otherTest_value"))
  @AttributeOverride(name = "remark", column = @Column(name = "otherTest_remark"))
  @Embedded
  private LaboratoryTestData otherTestData;

  @Override
  public Long getId() {
    return id;
  }

  public void setProcedure(StiProtectionProcedure procedure) {
    this.procedure = procedure;
  }

  // General
  public String getSampleBarCode() {
    return sampleBarCode;
  }

  public void setSampleBarCode(String sampleBarCode) {
    this.sampleBarCode = sampleBarCode;
  }

  public StiProtectionProcedure getProcedure() {
    return procedure;
  }

  public String getGeneralRemarks() {
    return generalRemarks;
  }

  public void setGeneralRemarks(String generalRemarks) {
    this.generalRemarks = generalRemarks;
  }

  public Boolean getTestsConducted() {
    return testsConducted;
  }

  public void setTestsConducted(Boolean testsConducted) {
    this.testsConducted = testsConducted;
  }

  public Boolean getTestsPayed() {
    return testsPayed;
  }

  public void setTestsPayed(Boolean testsPayed) {
    this.testsPayed = testsPayed;
  }

  // Tests
  public Boolean getHivRequested() {
    return hivRequested;
  }

  public void setHivRequested(Boolean hivRequested) {
    this.hivRequested = hivRequested;
  }

  public Boolean getSyphilisRequested() {
    return syphilisRequested;
  }

  public void setSyphilisRequested(Boolean syphilisRequested) {
    this.syphilisRequested = syphilisRequested;
  }

  public Boolean getHepARequested() {
    return hepARequested;
  }

  public void setHepARequested(Boolean hepARequested) {
    this.hepARequested = hepARequested;
  }

  public Boolean getHepBRequested() {
    return hepBRequested;
  }

  public void setHepBRequested(Boolean hepBRequested) {
    this.hepBRequested = hepBRequested;
  }

  public Boolean getHepCRequested() {
    return hepCRequested;
  }

  public void setHepCRequested(Boolean hepCRequested) {
    this.hepCRequested = hepCRequested;
  }

  public Boolean getChlamydiaRequested() {
    return chlamydiaRequested;
  }

  public void setChlamydiaRequested(Boolean chlamydiaRequested) {
    this.chlamydiaRequested = chlamydiaRequested;
  }

  public Boolean getGonorrheaRequested() {
    return gonorrheaRequested;
  }

  public void setGonorrheaRequested(Boolean gonorrheaRequested) {
    this.gonorrheaRequested = gonorrheaRequested;
  }

  public Boolean getMycoplasmaRequested() {
    return mycoplasmaRequested;
  }

  public void setMycoplasmaRequested(Boolean mycoplasmaRequested) {
    this.mycoplasmaRequested = mycoplasmaRequested;
  }

  public Boolean getCancerScreeningRequested() {
    return cancerScreeningRequested;
  }

  public void setCancerScreeningRequested(Boolean cancerScreeningRequested) {
    this.cancerScreeningRequested = cancerScreeningRequested;
  }

  public Boolean getHpvRequested() {
    return hpvRequested;
  }

  public void setHpvRequested(Boolean hpvRequested) {
    this.hpvRequested = hpvRequested;
  }

  public Boolean getMpoxRequested() {
    return mpoxRequested;
  }

  public void setMpoxRequested(Boolean mpoxRequested) {
    this.mpoxRequested = mpoxRequested;
  }

  public Boolean getOtherTestRequested() {
    return otherTestRequested;
  }

  public void setOtherTestRequested(Boolean otherTestRequested) {
    this.otherTestRequested = otherTestRequested;
  }

  public LaboratoryTestData getHivData() {
    return hivData;
  }

  public void setHivData(LaboratoryTestData hivData) {
    this.hivData = hivData;
  }

  public LaboratoryTestData getSyphilisData() {
    return syphilisData;
  }

  public void setSyphilisData(LaboratoryTestData syphilisData) {
    this.syphilisData = syphilisData;
  }

  public Boolean getHadSyphilis() {
    return hadSyphilis;
  }

  public void setHadSyphilis(Boolean hadSyphilis) {
    this.hadSyphilis = hadSyphilis;
  }

  public HepatitisLaboratoryTestData getHepAData() {
    return hepAData;
  }

  public void setHepAData(HepatitisLaboratoryTestData hepAData) {
    this.hepAData = hepAData;
  }

  public HepatitisLaboratoryTestData getHepBData() {
    return hepBData;
  }

  public void setHepBData(HepatitisLaboratoryTestData hepBData) {
    this.hepBData = hepBData;
  }

  public LaboratoryTestData getHepCData() {
    return hepCData;
  }

  public void setHepCData(LaboratoryTestData hepCData) {
    this.hepCData = hepCData;
  }

  public LaboratoryTestSamplesData getChlamydiaTestSamples() {
    return chlamydiaTestSamples;
  }

  public void setChlamydiaTestSamples(LaboratoryTestSamplesData chlamydiaTestSamples) {
    this.chlamydiaTestSamples = chlamydiaTestSamples;
  }

  public LaboratoryTestSamplesData getGonorrheaTestSamples() {
    return gonorrheaTestSamples;
  }

  public void setGonorrheaTestSamples(LaboratoryTestSamplesData gonorrheaTestSamples) {
    this.gonorrheaTestSamples = gonorrheaTestSamples;
  }

  public LaboratoryTestSamplesData getMycoplasmaTestSamples() {
    return mycoplasmaTestSamples;
  }

  public void setMycoplasmaTestSamples(LaboratoryTestSamplesData mycoplasmaTestSamples) {
    this.mycoplasmaTestSamples = mycoplasmaTestSamples;
  }

  public LaboratoryTestData getCancerScreeningData() {
    return cancerScreeningData;
  }

  public void setCancerScreeningData(LaboratoryTestData cancerScreeningData) {
    this.cancerScreeningData = cancerScreeningData;
  }

  public LaboratoryTestData getHpvData() {
    return hpvData;
  }

  public void setHpvData(LaboratoryTestData hpvData) {
    this.hpvData = hpvData;
  }

  public LaboratoryTestData getMpoxData() {
    return mpoxData;
  }

  public void setMpoxData(LaboratoryTestData mpoxData) {
    this.mpoxData = mpoxData;
  }

  public String getOtherTestName() {
    return otherTestName;
  }

  public void setOtherTestName(String otherTestName) {
    this.otherTestName = otherTestName;
  }

  public LaboratoryTestData getOtherTestData() {
    return otherTestData;
  }

  public void setOtherTestData(LaboratoryTestData otherTestData) {
    this.otherTestData = otherTestData;
  }
}
