/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.importer;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import java.time.LocalDate;
import java.util.Objects;

public final class PastProcedureListRowValues extends SchoolEntryRowValues {

  private ProcedureType procedureType;

  private LocalDate examinationDate;

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

  @Override
  boolean isDuplicateRow(Object other) {
    return (other instanceof PastProcedureListRowValues pastProcedureListRowValues)
        && Objects.equals(this.getChild(), pastProcedureListRowValues.getChild());
  }
}
