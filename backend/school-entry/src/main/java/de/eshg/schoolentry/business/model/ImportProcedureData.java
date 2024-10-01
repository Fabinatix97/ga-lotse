/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.schoolentry.api.CreatePersonDto;
import java.util.List;

public record ImportProcedureData(
    CreatePersonDto child,
    List<ImportCustodianData> custodians,
    ProcedureType procedureType,
    boolean isEntryLevel,
    boolean isEarlyExamination) {

  public ImportProcedureData(CreatePersonDto child, ProcedureType procedureType) {
    this(child, procedureType, false, false);
  }

  public ImportProcedureData(
      CreatePersonDto child,
      ProcedureType procedureType,
      boolean isEntryLevel,
      boolean isEarlyExamination) {
    this(child, List.of(), procedureType, isEntryLevel, isEarlyExamination);
  }
}
