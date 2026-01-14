/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.examination;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.examination.labtests.CancerScreeningTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.ChlamydiaTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.GonorrheaTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HepatitisATest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HepatitisBTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HepatitisCTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HivTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.HpvTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.LabTestData;
import de.eshg.stiprotection.persistence.db.examination.labtests.MpoxTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.MycoplasmaTest;
import de.eshg.stiprotection.persistence.db.examination.labtests.OtherTests;
import de.eshg.stiprotection.persistence.db.examination.labtests.SyphilisTest;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Entity
public class LaboratoryTestExamination extends GenericEntity<Long> {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Id
  private Long id;

  @MapsId
  @OneToOne(optional = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private StiProtectionProcedure procedure;

  // General
  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String sampleBarCode;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  private String generalRemarks;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private LocalDate testsConductedDate;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Boolean testsPayed;

  @OneToMany(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  @JoinColumn(name = LabTestData.LAB_TEST_EXAMINATION_ID)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OrderBy
  private final List<LabTestData> labTests = new ArrayList<>();

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

  public LocalDate getTestsConductedDate() {
    return testsConductedDate;
  }

  public void setTestsConductedDate(LocalDate testsConductedDate) {
    this.testsConductedDate = testsConductedDate;
  }

  public Boolean getTestsPayed() {
    return testsPayed;
  }

  public void setTestsPayed(Boolean testsPayed) {
    this.testsPayed = testsPayed;
  }

  // Tests
  public Boolean getHivRequested() {
    return getLabTest(HivTest.class).isPresent();
  }

  public boolean getSyphilisRequested() {
    return getLabTest(SyphilisTest.class).isPresent();
  }

  public boolean getHepARequested() {
    return getLabTest(HepatitisATest.class).isPresent();
  }

  public boolean getHepBRequested() {
    return getLabTest(HepatitisBTest.class).isPresent();
  }

  public boolean getHepCRequested() {
    return getLabTest(HepatitisCTest.class).isPresent();
  }

  public boolean getChlamydiaRequested() {
    return getLabTest(ChlamydiaTest.class).isPresent();
  }

  public boolean getGonorrheaRequested() {
    return getLabTest(GonorrheaTest.class).isPresent();
  }

  public boolean getMycoplasmaRequested() {
    return getLabTest(MycoplasmaTest.class).isPresent();
  }

  public boolean getCancerScreeningRequested() {
    return getLabTest(CancerScreeningTest.class).isPresent();
  }

  public boolean getHpvRequested() {
    return getLabTest(HpvTest.class).isPresent();
  }

  public boolean getMpoxRequested() {
    return getLabTest(MpoxTest.class).isPresent();
  }

  public boolean getOtherTestRequested() {
    return getLabTest(OtherTests.class).isPresent();
  }

  public Optional<HivTest> getHivData() {
    return getLabTest(HivTest.class);
  }

  public Optional<SyphilisTest> getSyphilisData() {
    return getLabTest(SyphilisTest.class);
  }

  public Optional<HepatitisATest> getHepAData() {
    return getLabTest(HepatitisATest.class);
  }

  public Optional<HepatitisBTest> getHepBData() {
    return getLabTest(HepatitisBTest.class);
  }

  public Optional<HepatitisCTest> getHepCData() {
    return getLabTest(HepatitisCTest.class);
  }

  public Optional<ChlamydiaTest> getChlamydiaTestSamples() {
    return getLabTest(ChlamydiaTest.class);
  }

  public Optional<GonorrheaTest> getGonorrheaTestSamples() {
    return getLabTest(GonorrheaTest.class);
  }

  public Optional<MycoplasmaTest> getMycoplasmaTestSamples() {
    return getLabTest(MycoplasmaTest.class);
  }

  public Optional<CancerScreeningTest> getCancerScreeningData() {
    return getLabTest(CancerScreeningTest.class);
  }

  public Optional<HpvTest> getHpvData() {
    return getLabTest(HpvTest.class);
  }

  public Optional<MpoxTest> getMpoxData() {
    return getLabTest(MpoxTest.class);
  }

  public Optional<OtherTests> getOtherTestData() {
    return getLabTest(OtherTests.class);
  }

  public boolean isAnyTestRequested() {
    return !labTests.isEmpty();
  }

  public boolean hasResultsForAllRequestedTests() {
    if (!isAnyTestRequested()) {
      return false;
    }
    return labTests.stream().allMatch(labTest -> Objects.nonNull(labTest.getResult()));
  }

  public List<LabTestData> getLabTests() {
    return labTests;
  }

  public void setLabTests(Collection<LabTestData> labTests) {
    this.labTests.clear();
    if (labTests != null) {
      this.labTests.addAll(labTests);
    }
  }

  public void addLabTest(LabTestData testData) {
    if (testData != null) {
      labTests.add(testData);
    }
  }

  public <T extends LabTestData> Optional<T> getLabTest(Class<T> clazz) {
    return labTests.stream().filter(clazz::isInstance).map(clazz::cast).findFirst();
  }
}
