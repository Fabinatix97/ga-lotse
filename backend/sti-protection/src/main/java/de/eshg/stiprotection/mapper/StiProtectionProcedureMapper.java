/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.stiprotection.api.CreateProcedureResponse;
import de.eshg.stiprotection.api.GetProcedureResponse;
import de.eshg.stiprotection.api.StiProtectionProcedureOverviewDto;
import de.eshg.stiprotection.api.citizen.GetCitizenProcedureResponse;
import de.eshg.stiprotection.mapper.waitingroom.WaitingRoomMapper;
import de.eshg.stiprotection.persistence.data.StiProtectionProcedureData;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;

public class StiProtectionProcedureMapper {

  private StiProtectionProcedureMapper() {}

  public static CreateProcedureResponse toInterfaceType(
      StiProtectionProcedure procedure, String pin) {
    return new CreateProcedureResponse(procedure.getExternalId(), pin);
  }

  public static GetProcedureResponse toInterfaceType(StiProtectionProcedureData procedureData) {
    return new GetProcedureResponse(
        procedureData.id(),
        procedureData.createdAt(),
        ProcedureMapper.toInterfaceType(procedureData.status()),
        ConcernMapper.toInterfaceType(procedureData.concern()),
        procedureData.isFollowUp(),
        PersonMapper.toInterfaceType(procedureData.person(), procedureData.accessCode()),
        AppointmentMapper.toInterfaceType(
            procedureData.appointment(), procedureData.userDefinedAppointment()),
        AppointmentHistoryMapper.toInterfaceType(procedureData.appointmentHistory()),
        WaitingRoomMapper.toInterfaceType(procedureData.waitingRoom()),
        LabStatusMapper.toInterfaceData(procedureData.procedure().getLabStatus()),
        procedureData.sampleBarCode());
  }

  public static GetCitizenProcedureResponse toCitizenInterfaceType(
      StiProtectionProcedureData procedureData) {
    return new GetCitizenProcedureResponse(
        ConcernMapper.toInterfaceType(procedureData.concern()),
        PersonMapper.toInterfaceType(procedureData.person(), procedureData.accessCode()),
        AppointmentMapper.toInterfaceType(
            procedureData.appointment(), procedureData.userDefinedAppointment()),
        AppointmentHistoryMapper.toInterfaceType(procedureData.appointmentHistory()));
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
        procedureData.accessCode(),
        LabStatusMapper.toInterfaceData(procedureData.procedure().getLabStatus()),
        procedureData.sampleBarCode(),
        procedureData.appointmentStart(),
        StiProcedureOriginMapper.toInterfaceData(procedureData.createdBy()));
  }
}
