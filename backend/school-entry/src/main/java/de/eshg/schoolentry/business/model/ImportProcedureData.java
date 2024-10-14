/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.api.CreatePersonDto;
import java.time.LocalDate;
import java.util.List;

public record ImportProcedureData(
    CreatePersonDto child,
    List<ImportCustodianData> custodians,
    ProcedureType procedureType,
    LocalDate examinationDate,
    boolean isEntryLevel,
    boolean isEarlyExamination,
    boolean hasInformationBlock) {

  public ImportProcedureData(CreatePersonDto child, ProcedureType procedureType) {
    this(child, procedureType, null, false, false, false);
  }

  public ImportProcedureData(
      CreatePersonDto child,
      ProcedureType procedureType,
      LocalDate examinationDate,
      boolean isEntryLevel,
      boolean isEarlyExamination,
      boolean hasInformationBlock) {
    this(
        child,
        List.of(),
        procedureType,
        examinationDate,
        isEntryLevel,
        isEarlyExamination,
        hasInformationBlock);
  }
}
