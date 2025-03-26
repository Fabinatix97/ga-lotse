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
import de.eshg.stiprotection.persistence.db.Person;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;

public class StiProtectionProcedureMapper {

  private StiProtectionProcedureMapper() {}

  public static CreateProcedureResponse toInterfaceType(
      StiProtectionProcedure procedure, String pin) {
    return new CreateProcedureResponse(procedure.getExternalId(), pin);
  }

  public static GetProcedureResponse toInterfaceType(StiProtectionProcedure procedure) {
    return new GetProcedureResponse(
        procedure.getExternalId(),
        procedure.getCreatedAt(),
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()),
        ConcernMapper.toInterfaceType(procedure.getConcern()),
        procedure.isFollowUp(),
        PersonMapper.toInterfaceType(procedure.getPerson(), procedure.getAccessCode()),
        AppointmentMapper.toInterfaceType(
            procedure.getAppointment(), procedure.getUserDefinedAppointment()),
        AppointmentHistoryMapper.toInterfaceType(procedure.getAppointmentHistory()),
        WaitingRoomMapper.toInterfaceType(procedure.getWaitingRoom()),
        LabStatusMapper.toInterfaceData(procedure.getLabStatus()),
        procedure.getSampleBarCode());
  }

  public static GetCitizenProcedureResponse toCitizenInterfaceType(
      StiProtectionProcedure procedure) {
    return new GetCitizenProcedureResponse(
        ConcernMapper.toInterfaceType(procedure.getConcern()),
        PersonMapper.toInterfaceType(procedure.getPerson(), procedure.getAccessCode()),
        AppointmentMapper.toInterfaceType(
            procedure.getAppointment(), procedure.getUserDefinedAppointment()),
        AppointmentHistoryMapper.toInterfaceType(procedure.getAppointmentHistory()),
        procedure.getMedicalHistorySubmitted());
  }

  public static StiProtectionProcedureOverviewDto toOverviewType(StiProtectionProcedure procedure) {
    Person person = procedure.getPerson();
    return new StiProtectionProcedureOverviewDto(
        procedure.getExternalId(),
        procedure.getCreatedAt(),
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()),
        ConcernMapper.toInterfaceType(procedure.getConcern()),
        person.getYearOfBirth(),
        person.getCountryOfBirth(),
        GenderMapper.toInterfaceType(person.getGender()),
        AppointmentMapper.toInterfaceType(
            procedure.getAppointment(), procedure.getUserDefinedAppointment()),
        procedure.getAccessCode(),
        LabStatusMapper.toInterfaceData(procedure.getLabStatus()),
        procedure.getSampleBarCode(),
        procedure.getAppointmentStart(),
        StiProcedureOriginMapper.toInterfaceData(procedure.getStiProcedureOrigin()));
  }
}
