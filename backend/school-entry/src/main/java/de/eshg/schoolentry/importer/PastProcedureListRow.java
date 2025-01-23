/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.domain.model.*;
import java.time.LocalDate;

public final class PastProcedureListRow extends SchoolEntryRow<PastProcedureListRow> {

  private ProcedureType procedureType;
  private LocalDate examinationDate;
  private Anamnesis anamnesis;
  private VaccinationStatus vaccinationStatus;
  private EyeExaminationResult eyeExaminationResult;
  private HearingTestResult hearingTest;
  private SopessExaminationResult sopessExamination;
  private DevelopmentScreening developmentScreening;

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

  public Anamnesis getAnamnesis() {
    return anamnesis;
  }

  public void setAnamnesis(Anamnesis anamnesis) {
    this.anamnesis = anamnesis;
  }

  public VaccinationStatus getVaccinationStatus() {
    return vaccinationStatus;
  }

  public void setVaccinationStatus(VaccinationStatus vaccinationStatus) {
    this.vaccinationStatus = vaccinationStatus;
  }

  public EyeExaminationResult getEyeExaminationResult() {
    return eyeExaminationResult;
  }

  public void setEyeExaminationResult(EyeExaminationResult eyeExaminationResult) {
    this.eyeExaminationResult = eyeExaminationResult;
  }

  public HearingTestResult getHearingTest() {
    return hearingTest;
  }

  public void setHearingTest(HearingTestResult hearingTest) {
    this.hearingTest = hearingTest;
  }

  public SopessExaminationResult getSopessExamination() {
    return sopessExamination;
  }

  public void setSopessExamination(SopessExaminationResult sopessExamination) {
    this.sopessExamination = sopessExamination;
  }

  public DevelopmentScreening getDevelopmentScreening() {
    return developmentScreening;
  }

  public void setDevelopmentScreening(DevelopmentScreening developmentScreening) {
    this.developmentScreening = developmentScreening;
  }
}
