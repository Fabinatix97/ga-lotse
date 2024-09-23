/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.stiprotection.api.CreateProcedureResponse;
import de.eshg.stiprotection.api.StiProtectionProcedureDto;
import de.eshg.stiprotection.api.StiProtectionProcedureOverviewDto;
import de.eshg.stiprotection.persistence.data.StiProtectionProcedureData;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;

public class StiProtectionProcedureMapper {

  private StiProtectionProcedureMapper() {}

  public static CreateProcedureResponse toInterfaceType(StiProtectionProcedure procedure) {
    return new CreateProcedureResponse(procedure.getExternalId());
  }

  public static StiProtectionProcedureDto toInterfaceType(
      StiProtectionProcedureData procedureData) {
    return new StiProtectionProcedureDto(
        procedureData.id(),
        procedureData.createdAt(),
        ProcedureMapper.toInterfaceType(procedureData.status()),
        ConcernMapper.toInterfaceType(procedureData.concern()),
        PersonMapper.toInterfaceType(procedureData.person()));
  }

  public static StiProtectionProcedureOverviewDto toOverviewType(
      StiProtectionProcedureData procedureData) {
    return new StiProtectionProcedureOverviewDto(
        procedureData.id(),
        procedureData.createdAt(),
        ProcedureMapper.toInterfaceType(procedureData.status()),
        ConcernMapper.toInterfaceType(procedureData.concern()),
        procedureData.person().getYearOfBirth(),
        GenderMapper.toInterfaceType(procedureData.person().getGender()));
  }
}
