/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.business.model.ImportAnamnesisData;
import de.eshg.schoolentry.business.model.ImportVaccinationStatusData;
import de.eshg.schoolentry.domain.model.DevelopmentScreening;
import de.eshg.schoolentry.domain.model.EyeExaminationResult;
import de.eshg.schoolentry.domain.model.HearingTestResult;
import de.eshg.schoolentry.domain.model.SopessExaminationResult;
import java.time.LocalDate;
import java.util.Objects;

public final class PastProcedureListRowValues extends SchoolEntryRowValues {

  private ProcedureType procedureType;

  private LocalDate examinationDate;

  private ImportAnamnesisData anamnesisData;

  private ImportVaccinationStatusData vaccinationStatusData;

  private EyeExaminationResult eyeExaminationResult;

  private HearingTestResult hearingTestData;

  private SopessExaminationResult sopessExaminationData;

  private DevelopmentScreening developmentScreeningData;

  public ProcedureType getProcedureType() {
    return procedureType;
  }

  public void setProcedureType(ProcedureType procedureType) {
    this.procedureType = procedureType;
  }

  public LocalDate getExaminationDate() {
    return examinationDate;
  }

  public void setExaminationDate(LocalDate examinationDate) {
    this.examinationDate = examinationDate;
  }

  public ImportAnamnesisData getAnamnesisData() {
    return anamnesisData;
  }

  public void setAnamnesisData(ImportAnamnesisData anamnesisData) {
    this.anamnesisData = anamnesisData;
  }

  public ImportVaccinationStatusData getVaccinationStatusData() {
    return vaccinationStatusData;
  }

  public void setVaccinationStatusData(ImportVaccinationStatusData vaccinationStatusData) {
    this.vaccinationStatusData = vaccinationStatusData;
  }

  public EyeExaminationResult getEyeExaminationResult() {
    return eyeExaminationResult;
  }

  public void setEyeExaminationResult(EyeExaminationResult eyeExaminationResult) {
    this.eyeExaminationResult = eyeExaminationResult;
  }

  public HearingTestResult getHearingTestData() {
    return hearingTestData;
  }

  public void setHearingTestData(HearingTestResult hearingTestData) {
    this.hearingTestData = hearingTestData;
  }

  public SopessExaminationResult getSopessExaminationData() {
    return sopessExaminationData;
  }

  public void setSopessExaminationData(SopessExaminationResult sopessExaminationData) {
    this.sopessExaminationData = sopessExaminationData;
  }

  public DevelopmentScreening getDevelopmentScreeningData() {
    return developmentScreeningData;
  }

  public void setDevelopmentScreeningData(DevelopmentScreening developmentScreeningData) {
    this.developmentScreeningData = developmentScreeningData;
  }

  @Override
  boolean isDuplicateRow(Object other) {
    return (other instanceof PastProcedureListRowValues pastProcedureListRowValues)
        && Objects.equals(this.getChild(), pastProcedureListRowValues.getChild());
  }
}
