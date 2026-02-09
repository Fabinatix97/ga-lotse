/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.model.NewCertificateProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.lib.appointmentblock.AbstractAppointmentService;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import java.time.Clock;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.stereotype.Service;

@Service
public class InfectionBriefingAppointmentService
    extends AbstractAppointmentService<InfectionBriefingProcedure> {

  private final Clock clock;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final InfectionBriefingAppointmentStandardDurationService standardDurationService;
  private final InfectionBriefingProcedureRepository procedureRepository;
  private final PersonApi personApi;

  public InfectionBriefingAppointmentService(
      Clock clock,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      InfectionBriefingAppointmentStandardDurationService standardDurationService,
      InfectionBriefingProcedureRepository procedureRepository,
      PersonApi personApi) {
    this.clock = clock;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.standardDurationService = standardDurationService;
    this.procedureRepository = procedureRepository;
    this.personApi = personApi;
  }

  public AppointmentDto bookAppointment(NewCertificateProcedure procedure, Instant startTime) {
    return bookAppointment(procedure, startTime, AppointmentType.INFECTION_BRIEFING_NEW);
  }

  private AppointmentDto bookAppointment(
      InfectionBriefingProcedure procedure, Instant startTime, AppointmentType appointmentType) {
    Instant endTime = startTime.plus(standardDurationService.getStandardDuration(appointmentType));
    appointmentBlockSlotUtil.updateAppointment(
        appointmentType, null, null, procedure, startTime, endTime);
    return new AppointmentDto(startTime, endTime);
  }

  @Override
  protected Clock getClock() {
    return clock;
  }

  @Override
  protected List<InfectionBriefingProcedure> resolveEntitiesWithAppointments(
      List<Appointment> appointments) {
    return procedureRepository.findByAppointmentIn(appointments);
  }

  @Override
  protected Map<InfectionBriefingProcedure, String> getInformationForAppointmentOverview(
      List<InfectionBriefingProcedure> procedures) {
    List<UUID> centralFileStateIds =
        procedures.stream()
            .map(Procedure::getRelatedPersons)
            .flatMap(Collection::stream)
            .map(RelatedPerson::getCentralFileStateId)
            .toList();
    Map<UUID, String> personMap =
        personApi
            .getPersonFileStates(new GetPersonFileStatesRequest(centralFileStateIds))
            .personFileStates()
            .stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    GetPersonFileStateResponse::id,
                    person -> "%s %s".formatted(person.firstName(), person.lastName())));
    return procedures.stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                Function.identity(),
                procedure ->
                    personMap.get(
                        procedure.getRelatedPersons().stream()
                            .collect(StreamUtil.toSingleElement())
                            .getCentralFileStateId())));
  }

  @Override
  protected UUID getProcedureId(InfectionBriefingProcedure entity) {
    return entity.getExternalId();
  }
}
