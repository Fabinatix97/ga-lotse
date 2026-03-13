/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.mapper;

import static de.eshg.infectionbriefing.util.ProcedureUtil.getFieldOrNull;
import static de.eshg.lib.procedure.mapping.ProcedureMapper.toInterfaceType;

import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.infectionbriefing.api.InfectionBriefingProcedureDto;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public class InfectionBriefingProcedureMapper {

  private InfectionBriefingProcedureMapper() {}

  public static InfectionBriefingProcedureDto enrichAndMapToInterfaceType(
      InfectionBriefingProcedure procedure, Map<UUID, GetPersonFileStateResponse> personDirectory) {
    GetPersonFileStateResponse person =
        personDirectory.get(procedure.getApplicant().getCentralFileStateId());
    Appointment appointment = procedure.getAppointment();
    return new InfectionBriefingProcedureDto(
        procedure.getExternalId(),
        person.firstName(),
        person.lastName(),
        person.dateOfBirth(),
        toInterfaceType(procedure.getProcedureStatus()),
        toInterfaceType(procedure.getProcedureType()),
        getAppointmentTime(appointment),
        getFieldOrNull(procedure, NewCertificateProcedure::getInstructionDate),
        InstructionTypeMapper.toInterfaceType(
            getFieldOrNull(procedure, NewCertificateProcedure::getInstructionType)));
  }

  public static LinkedHashSet<ProcedureStatus> toDomainType(
      LinkedHashSet<ProcedureStatusDto> statusSet) {
    if (statusSet == null) {
      return null;
    }
    return new LinkedHashSet<>(statusSet.stream().map(ProcedureMapper::toDomainType).toList());
  }

  private static Instant getAppointmentTime(Appointment appointment) {
    return Optional.ofNullable(appointment).map(Appointment::getAppointmentStart).orElse(null);
  }
}
