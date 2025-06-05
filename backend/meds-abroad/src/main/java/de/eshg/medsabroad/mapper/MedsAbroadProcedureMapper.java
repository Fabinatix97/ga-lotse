/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.mapper;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.medsabroad.api.GetMedsAbroadProcedureResponse;
import de.eshg.medsabroad.api.MedsAbroadProcedureDto;
import de.eshg.medsabroad.persistence.centralfile.MedsAbroadProcedureDetails;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;
import java.util.Optional;

public class MedsAbroadProcedureMapper {

  private MedsAbroadProcedureMapper() {}

  public static GetMedsAbroadProcedureResponse toInterfaceType(
      MedsAbroadProcedureDetails procedureDetails) {
    MedsAbroadProcedure procedure = procedureDetails.procedure();
    return new GetMedsAbroadProcedureResponse(
        procedure.getExternalId(),
        procedure.getCreatedAt(),
        PersonMapper.toInterfaceType(procedureDetails.personDetails()),
        Optional.ofNullable(procedure.getAppointment())
            .map(Appointment::getAppointmentStart)
            .orElse(null),
        procedure.isCertificatePaid(),
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()));
  }

  public static MedsAbroadProcedureDto toOverviewType(MedsAbroadProcedureDetails procedureDetails) {
    MedsAbroadProcedure procedure = procedureDetails.procedure();

    return new MedsAbroadProcedureDto(
        procedure.getExternalId(),
        procedure.getCreatedAt(),
        PersonMapper.toInterfaceType(procedureDetails.personDetails()),
        Optional.ofNullable(procedure.getAppointment())
            .map(Appointment::getAppointmentStart)
            .orElse(null),
        procedure.isCertificatePaid(),
        ProcedureMapper.toInterfaceType(procedure.getProcedureStatus()));
  }
}
