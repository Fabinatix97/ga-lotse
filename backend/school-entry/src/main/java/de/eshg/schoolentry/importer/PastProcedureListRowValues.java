/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.business.model.ImportAnamnesisData;
import de.eshg.schoolentry.business.model.ImportVaccinationStatusData;
import java.time.LocalDate;
import java.util.Objects;

public final class PastProcedureListRowValues extends SchoolEntryRowValues {

  private ProcedureType procedureType;

  private LocalDate examinationDate;

  private ImportAnamnesisData anamnesisData;

  private ImportVaccinationStatusData vaccinationStatusData;

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

  @Override
  boolean isDuplicateRow(Object other) {
    return (other instanceof PastProcedureListRowValues pastProcedureListRowValues)
        && Objects.equals(this.getChild(), pastProcedureListRowValues.getChild());
  }
}
