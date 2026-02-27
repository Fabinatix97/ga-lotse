/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.mapper;

import de.eshg.lib.procedure.api.ProcedureSearchParameters;

public class ProcedureSearchParametersMapper {

  private ProcedureSearchParametersMapper() {}

  public static ProcedureSearchParameters mapToProcedureApiType(
      de.eshg.infectionbriefing.api.ProcedureSearchParameters procedureSearchParameters) {
    return new ProcedureSearchParameters(
        procedureSearchParameters.searchFirstName(),
        procedureSearchParameters.searchLastName(),
        procedureSearchParameters.searchDateOfBirth());
  }
}
