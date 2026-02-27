/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.mapper;

import static de.eshg.infectionbriefing.util.ProcedureUtil.getFieldOrNull;
import static de.eshg.lib.procedure.mapping.ProcedureMapper.toInterfaceType;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.infectionbriefing.PersonClient;
import de.eshg.infectionbriefing.api.ProcedureDto;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import java.time.Instant;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class InfectionBriefingProcedureMapper {

  private final PersonClient personClient;

  public InfectionBriefingProcedureMapper(PersonClient personClient) {
    this.personClient = personClient;
  }

  public ProcedureDto enrichAndMapToInterfaceType(InfectionBriefingProcedure procedure) {
    GetPersonFileStateResponse person =
        personClient.getPersonFileState(
            procedure.getRelatedPersons().stream()
                .map(RelatedPerson::getCentralFileStateId)
                .collect(StreamUtil.toSingleElement()));
    Appointment appointment = procedure.getAppointment();
    return new ProcedureDto(
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

  private static Instant getAppointmentTime(Appointment appointment) {
    return Optional.ofNullable(appointment).map(Appointment::getAppointmentStart).orElse(null);
  }
}
