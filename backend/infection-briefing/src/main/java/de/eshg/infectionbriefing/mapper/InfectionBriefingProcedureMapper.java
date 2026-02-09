/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.mapper;

import static de.eshg.lib.procedure.mapping.ProcedureMapper.toInterfaceType;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.infectionbriefing.api.ProcedureDto;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import java.time.Instant;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class InfectionBriefingProcedureMapper {

  private final PersonApi personApi;

  public InfectionBriefingProcedureMapper(PersonApi personApi) {
    this.personApi = personApi;
  }

  public ProcedureDto enrichAndMapToInterfaceType(InfectionBriefingProcedure procedure) {
    GetPersonFileStateResponse person =
        personApi.getPersonFileState(
            procedure.getRelatedPersons().stream()
                .map(RelatedPerson::getCentralFileStateId)
                .collect(StreamUtil.toSingleElement()));
    Appointment appointment = procedure.getAppointment();
    return new ProcedureDto(
        procedure.getExternalId(),
        person.lastName(),
        person.firstName(),
        person.dateOfBirth(),
        toInterfaceType(procedure.getProcedureStatus()),
        toInterfaceType(procedure.getProcedureType()),
        getAppointmentStart(appointment),
        getAppointmentEnd(appointment));
  }

  private static Instant getAppointmentStart(Appointment appointment) {
    return Optional.ofNullable(appointment).map(Appointment::getAppointmentStart).orElse(null);
  }

  private static Instant getAppointmentEnd(Appointment appointment) {
    return Optional.ofNullable(appointment).map(Appointment::getAppointmentEnd).orElse(null);
  }
}
