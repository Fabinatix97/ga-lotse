/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.schoolentry.api.CreatePersonDto;
import de.eshg.schoolentry.api.ProcedureTypeDto;
import java.util.List;

public record ImportProcedureData(
    CreatePersonDto child,
    List<ImportCustodianData> custodians,
    ProcedureTypeDto procedureType,
    boolean isEntryLevel,
    boolean isEarlyExamination) {

  public ImportProcedureData(CreatePersonDto child, ProcedureTypeDto procedureType) {
    this(child, procedureType, false, false);
  }

  public ImportProcedureData(
      CreatePersonDto child,
      ProcedureTypeDto procedureType,
      boolean isEntryLevel,
      boolean isEarlyExamination) {
    this(child, List.of(), procedureType, isEntryLevel, isEarlyExamination);
  }
}
