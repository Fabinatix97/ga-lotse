/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.stiprotection.api.CreateProcedureResponse;
import de.eshg.stiprotection.api.StiProtectionProcedureDto;
import de.eshg.stiprotection.api.StiProtectionProcedureOverviewDto;
import de.eshg.stiprotection.mapper.waitingroom.WaitingRoomMapper;
import de.eshg.stiprotection.persistence.data.StiProtectionProcedureData;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;

public class StiProtectionProcedureMapper {

  private StiProtectionProcedureMapper() {}

  public static CreateProcedureResponse toInterfaceType(
      StiProtectionProcedure procedure, String pin) {
    return new CreateProcedureResponse(procedure.getExternalId(), pin);
  }

  public static StiProtectionProcedureDto toInterfaceType(
      StiProtectionProcedureData procedureData) {
    return new StiProtectionProcedureDto(
        procedureData.id(),
        procedureData.createdAt(),
        ProcedureMapper.toInterfaceType(procedureData.status()),
        ConcernMapper.toInterfaceType(procedureData.concern()),
        PersonMapper.toInterfaceType(procedureData.person(), procedureData.accessCode()),
        AppointmentMapper.toInterfaceType(
            procedureData.appointment(), procedureData.userDefinedAppointment()),
        AppointmentHistoryMapper.toInterfaceType(procedureData.appointmentHistory()),
        WaitingRoomMapper.toInterfaceType(procedureData.waitingRoom()));
  }

  public static StiProtectionProcedureOverviewDto toOverviewType(
      StiProtectionProcedureData procedureData) {
    return new StiProtectionProcedureOverviewDto(
        procedureData.id(),
        procedureData.createdAt(),
        ProcedureMapper.toInterfaceType(procedureData.status()),
        ConcernMapper.toInterfaceType(procedureData.concern()),
        procedureData.person().getYearOfBirth(),
        procedureData.person().getCountryOfBirth(),
        GenderMapper.toInterfaceType(procedureData.person().getGender()),
        AppointmentMapper.toInterfaceType(
            procedureData.appointment(), procedureData.userDefinedAppointment()),
        procedureData.accessCode());
  }
}
