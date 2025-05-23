/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.mapper;

import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.medsabroad.api.GetMedsAbroadProcedureResponse;
import de.eshg.medsabroad.api.MedsAbroadProcedureDto;
import de.eshg.medsabroad.persistence.centralfile.MedsAbroadProcedureDetails;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;

public class MedsAbroadProcedureMapper {

  private MedsAbroadProcedureMapper() {}

  public static GetMedsAbroadProcedureResponse toInterfaceType(
      MedsAbroadProcedureDetails procedureDetails) {
    MedsAbroadProcedure procedure = procedureDetails.procedure();
    return new GetMedsAbroadProcedureResponse(
        procedure.getExternalId(),
        procedure.getCreatedAt(),
        PersonMapper.toInterfaceType(procedureDetails.personDetails()),
        null,
        false,
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()));
  }

  public static MedsAbroadProcedureDto toOverviewType(MedsAbroadProcedureDetails procedureDetails) {
    MedsAbroadProcedure procedure = procedureDetails.procedure();

    return new MedsAbroadProcedureDto(
        procedure.getExternalId(),
        procedure.getCreatedAt(),
        PersonMapper.toInterfaceType(procedureDetails.personDetails()),
        // Todo: Set appointment data to something until it is fully implemented
        //      otherwise the @NotNull in the dto will lead to an error
        procedure.getCreatedAt(),
        false,
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()));
  }
}
