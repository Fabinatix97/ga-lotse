/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.infectionbriefing.api.AppointmentSummaryDto;
import de.eshg.infectionbriefing.api.GetCitizenAppointmentOverviewResponse;
import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.infectionbriefing.domain.repository.InfectionBriefingProcedureRepository;
import de.eshg.lib.appointmentblock.AbstractAppointmentService;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.AppointmentTypeMapper;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.rest.service.error.BadRequestException;
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
  private final PersonClient personClient;
  private final InfectionBriefingProcedureRepository procedureRepository;
  private final MailService mailService;

  public InfectionBriefingAppointmentService(
      Clock clock,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      InfectionBriefingAppointmentStandardDurationService standardDurationService,
      PersonClient personClient,
      InfectionBriefingProcedureRepository procedureRepository,
      MailService mailService) {
    this.clock = clock;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.standardDurationService = standardDurationService;
    this.personClient = personClient;
    this.procedureRepository = procedureRepository;
    this.mailService = mailService;
  }

  public AppointmentDto bookAppointment(
      InfectionBriefingProcedure procedure, AppointmentType appointmentType, Instant startTime) {
    Instant endTime = startTime.plus(standardDurationService.getStandardDuration(appointmentType));
    appointmentBlockSlotUtil.updateAppointment(
        appointmentType, null, null, procedure, startTime, endTime);
    return new AppointmentDto(startTime, endTime);
  }

  public GetCitizenAppointmentOverviewResponse getAppointsmentOfCitizen(UUID citizenUserId) {
    InfectionBriefingProcedure procedure = getProcedureByUser(citizenUserId);

    Appointment appointment = procedure.getAppointment();
    AppointmentTypeDto interfaceType = AppointmentTypeMapper.toInterfaceType(appointment.getType());

    GetPersonFileStateResponse personFileStateResponse = getPersonDetailsByProcedure(procedure);

    var appointmentSummaryDto =
        new AppointmentSummaryDto(appointment.getAppointmentStart(), interfaceType);
    return new GetCitizenAppointmentOverviewResponse(
        appointmentSummaryDto,
        personFileStateResponse.lastName(),
        personFileStateResponse.firstName(),
        personFileStateResponse.dateOfBirth());
  }

  public void cancelAppointmentByCitizen(UUID citizenUserId) {
    InfectionBriefingProcedure procedure = getProcedureByUser(citizenUserId);
    Appointment appointment = procedure.getAppointment();
    appointmentBlockSlotUtil.removeAppointment(procedure);
    procedureRepository.delete(procedure);

    GetPersonFileStateResponse personDetails = getPersonDetailsByProcedure(procedure);
    personDetails
        .emailAddresses()
        .forEach(email -> mailService.sendCancelAppointmentConfirmationMail(email, appointment));
  }

  private InfectionBriefingProcedure getProcedureByUser(UUID citizenUserId) {
    return procedureRepository.getByCitizenUserId(citizenUserId).stream()
        .collect(StreamUtil.toSingleOptionalElement())
        .orElseThrow(() -> new BadRequestException("Citizen has no procedures"));
  }

  public GetPersonFileStateResponse getPersonDetailsByProcedure(
      InfectionBriefingProcedure procedure) {
    UUID centralFileStateId = procedure.getRelatedPersons().getFirst().getCentralFileStateId();
    return personClient.getPersonFileState(centralFileStateId);
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
        personClient.getPersonFileStates(centralFileStateIds).stream()
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
