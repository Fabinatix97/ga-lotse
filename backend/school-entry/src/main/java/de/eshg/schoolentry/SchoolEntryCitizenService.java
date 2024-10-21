/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.ANAMNESIS_ADDED_BY_CITIZEN;
import static de.eshg.schoolentry.util.SchoolEntrySystemProgressEntryType.APPOINTMENT_RESCHEDULED_BY_CITIZEN;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.client.ContactClient;
import de.eshg.base.contact.api.ContactDto;
import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.model.AppointmentBlockSlot;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.document.generator.department.DepartmentClient;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.schoolentry.api.citizen.AppointmentAddressDto;
import de.eshg.schoolentry.api.citizen.CitizenAnamnesisDto;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import de.eshg.schoolentry.domain.model.Anamnesis;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;
import de.eshg.schoolentry.domain.repository.SchoolEntryProcedureRepository;
import de.eshg.schoolentry.mapper.AnamnesisMapper;
import de.eshg.schoolentry.util.ProgressEntryUtil;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class SchoolEntryCitizenService {

  private static final Logger log = LoggerFactory.getLogger(SchoolEntryCitizenService.class);

  private final Clock clock;
  private final SchoolEntryProperties.Citizens citizensProperties;
  private final SchoolEntryProcedureRepository schoolEntryProcedureRepository;
  private final SchoolEntryService schoolEntryService;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final DepartmentClient departmentClient;
  private final ContactClient contactClient;

  public SchoolEntryCitizenService(
      Clock clock,
      SchoolEntryProperties schoolEntryProperties,
      SchoolEntryProcedureRepository schoolEntryProcedureRepository,
      SchoolEntryService schoolEntryService,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      DepartmentClient departmentClient,
      ContactClient contactClient) {
    this.clock = clock;
    this.citizensProperties = schoolEntryProperties.getCitizens();
    this.schoolEntryProcedureRepository = schoolEntryProcedureRepository;
    this.schoolEntryService = schoolEntryService;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.departmentClient = departmentClient;
    this.contactClient = contactClient;
  }

  SchoolEntryProcedure findOrThrow(UUID userId) {
    return schoolEntryProcedureRepository
        .findOneByCitizenUserId(userId)
        .orElseThrow(SchoolEntryCitizenService::procedureNotFoundException);
  }

  SchoolEntryProcedure findForUpdateOrThrow(UUID userId) {
    return schoolEntryProcedureRepository
        .findOneByCitizenUserIdForUpdate(userId)
        .orElseThrow(SchoolEntryCitizenService::procedureNotFoundException);
  }

  private static NotFoundException procedureNotFoundException() {
    return new NotFoundException("Found no school entry procedure for the current user");
  }

  List<AppointmentDto> getFreeAppointments(SchoolEntryProcedure schoolEntryProcedure) {
    Instant now = Instant.now(clock);
    Instant earliestStart = now.plus(citizensProperties.freeAppointmentsMinLeadTime());
    Instant latestStart = now.plus(citizensProperties.freeAppointmentsMaxLeadTime());

    AppointmentType appointmentType;
    try {
      appointmentType = schoolEntryService.computeAppointmentType(schoolEntryProcedure, null, null);
    } catch (BadRequestException e) {
      log.info(
          "Failed to compute appointment type, therefore no free appointments can be found.", e);
      return List.of();
    }
    return schoolEntryService
        .getFreeAppointmentsForProcedure(
            schoolEntryProcedure, earliestStart, latestStart, false, appointmentType)
        .stream()
        .filter(excludeAppointment(schoolEntryProcedure.getAppointment()))
        .toList();
  }

  private static Predicate<AppointmentDto> excludeAppointment(Appointment appointment) {
    Instant appointmentStart = appointment.getAppointmentStart();
    return freeAppointment -> !freeAppointment.start().equals(appointmentStart);
  }

  public void updateAppointment(
      SchoolEntryProcedure schoolEntryProcedure, Instant start, Instant end) {
    validateIsFreeAppointment(schoolEntryProcedure, start, end);

    AppointmentType appointmentType =
        schoolEntryService.computeAppointmentType(schoolEntryProcedure, null, null);

    appointmentBlockSlotUtil.updateAppointment(
        appointmentType,
        schoolEntryService.getAppointmentLocation(schoolEntryProcedure),
        schoolEntryProcedure,
        start,
        end);
    schoolEntryProcedure.setAppointmentChangesByCitizen(
        schoolEntryProcedure.getAppointmentChangesByCitizen() + 1);

    ProgressEntryUtil.addProgressEntry(
        schoolEntryProcedure, APPOINTMENT_RESCHEDULED_BY_CITIZEN, TriggerType.CITIZEN);
    schoolEntryProcedure
        .getTaskOfType(TaskType.PERFORM_SCHOOL_ENTRY_EXAMINATION)
        .updateDueAt(start);
  }

  private void validateIsFreeAppointment(
      SchoolEntryProcedure schoolEntryProcedure, Instant start, Instant end) {
    List<AppointmentDto> freeAppointments = getFreeAppointments(schoolEntryProcedure);
    AppointmentBlockSlot requestedSlot = new AppointmentBlockSlot(start, end);
    freeAppointments.stream()
        .map(appointment -> new AppointmentBlockSlot(appointment.start(), appointment.end()))
        .filter(requestedSlot::equals)
        .collect(StreamUtil.toSingleOptionalElement())
        .orElseThrow(
            () ->
                new BadRequestException(
                    ErrorCode.CONFLICT,
                    "Requested appointment is not in the list of free appointments"));
  }

  void addCitizenAnamnesis(SchoolEntryProcedure procedure, CitizenAnamnesisDto anamnesis) {
    Anamnesis citizenAnamnesisAsDomainModel =
        AnamnesisMapper.mapCitizenAnamnesisToDomain(anamnesis);
    schoolEntryService.copyValues(citizenAnamnesisAsDomainModel, procedure.getAnamnesis());
    ProgressEntryUtil.addProgressEntry(procedure, ANAMNESIS_ADDED_BY_CITIZEN, TriggerType.CITIZEN);
  }

  public AppointmentAddressDto getAppointmentAddress(SchoolEntryProcedure procedure) {
    return Optional.ofNullable(schoolEntryService.getAppointmentLocation(procedure))
        .map(contactId -> mapToAppointmentAddress(contactClient.getContact(contactId)))
        .orElse(mapToAppointmentAddress(departmentClient.getDepartmentInfo()));
  }

  private AppointmentAddressDto mapToAppointmentAddress(
      GetDepartmentInfoResponse departmentInfoResponse) {
    return new AppointmentAddressDto(
        departmentInfoResponse.name(),
        new DomesticAddressDto(
            departmentInfoResponse.country(),
            departmentInfoResponse.city(),
            departmentInfoResponse.postalCode(),
            null,
            departmentInfoResponse.street(),
            departmentInfoResponse.houseNumber(),
            null));
  }

  private AppointmentAddressDto mapToAppointmentAddress(ContactDto contact) {
    Assert.isInstanceOf(DomesticAddressDto.class, contact.contactAddress());
    return new AppointmentAddressDto(
        contact.name(), ((DomesticAddressDto) contact.contactAddress()));
  }
}
