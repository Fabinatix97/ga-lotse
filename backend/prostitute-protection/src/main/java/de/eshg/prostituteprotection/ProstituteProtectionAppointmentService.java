/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.calendar.CalendarApi;
import de.eshg.base.calendar.CalendarEventApi;
import de.eshg.base.calendar.api.BusinessCaseEventRequest;
import de.eshg.base.calendar.api.DetailedEvent;
import de.eshg.base.calendar.api.EventTimeData;
import de.eshg.base.calendar.api.GetUserCalendarsRequest;
import de.eshg.base.calendar.api.GetUserCalendarsResponse;
import de.eshg.base.calendar.api.UserCalendar;
import de.eshg.lib.appointmentblock.AbstractAppointmentService;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.prostituteprotection.domain.data.AppointmentData;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.model.UserDefinedAppointment;
import de.eshg.prostituteprotection.domain.repository.ProstituteProtectionProcedureRepository;
import de.eshg.rest.service.error.BadRequestException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class ProstituteProtectionAppointmentService
    extends AbstractAppointmentService<ProstituteProtectionProcedure> {
  private final Clock clock;
  private final ProstituteProtectionProcedureRepository prostituteProtectionProcedureRepository;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final AppointmentBlockService appointmentBlockService;
  private final CalendarApi calendarApi;
  private final CalendarEventApi calendarEventApi;

  public ProstituteProtectionAppointmentService(
      Clock clock,
      ProstituteProtectionProcedureRepository prostituteProtectionProcedureRepository,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      AppointmentBlockService appointmentBlockService,
      CalendarApi calendarApi,
      CalendarEventApi calendarEventApi) {
    this.clock = clock;
    this.prostituteProtectionProcedureRepository = prostituteProtectionProcedureRepository;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.appointmentBlockService = appointmentBlockService;
    this.calendarApi = calendarApi;
    this.calendarEventApi = calendarEventApi;
  }

  List<AppointmentDto> getFreeAppointmentsForProcedure(
      ProstituteProtectionProcedure procedure, AppointmentType appointmentType) {
    List<AppointmentDto> freeAppointments =
        appointmentBlockService.getFreeAppointments(null, null, appointmentType, null, null);

    return AppointmentBlockService.filterFreeAppointmentsIncludeExisting(
        freeAppointments, procedure.getAppointment());
  }

  void bookAppointment(ProstituteProtectionProcedure procedure, AppointmentData appointment) {
    AppointmentType type = appointment.appointmentType();
    Instant start = appointment.appointmentStart();
    Instant end = start.plus(Duration.ofMinutes(appointment.durationInMinutes()));
    switch (appointment.appointmentBookingType()) {
      case APPOINTMENT_BLOCK -> bookAppointmentFromAppointmentBlock(procedure, type, start, end);
      case USER_DEFINED, SPONTANEOUS ->
          bookUserDefinedAppointment(procedure, start, end, appointment.consultantId());
      default ->
          throw new BadRequestException(
              "Unsupported booking type: " + appointment.appointmentBookingType());
    }
  }

  private void bookUserDefinedAppointment(
      ProstituteProtectionProcedure procedure, Instant start, Instant end, UUID consultantId) {
    Assert.notNull(consultantId, "Consultant ID must not be null for user-defined appointments");
    procedure.setAppointment(null);
    boolean appointmentHasChanged = appointmentHasChanged(procedure, start, end);
    boolean consultantHasChanged = consultantHasChanged(procedure, consultantId);

    if (appointmentHasChanged) {
      if (procedure.getUserDefinedAppointment() == null) {
        procedure.setUserDefinedAppointment(new UserDefinedAppointment());
      }
      procedure.getUserDefinedAppointment().setAppointmentStart(start);
      procedure.getUserDefinedAppointment().setAppointmentEnd(end);
    }
    if (consultantHasChanged) {
      procedure.setConsultantId(consultantId);
    }
    if (consultantHasChanged || appointmentHasChanged) {
      deleteAppointmentCalendarEvent(procedure);
      createAppointmentCalendarEvent(procedure, start, end);
    }
  }

  private boolean consultantHasChanged(ProstituteProtectionProcedure procedure, UUID consultantId) {
    return !Objects.equals(procedure.getConsultantId(), consultantId);
  }

  private boolean appointmentHasChanged(
      ProstituteProtectionProcedure procedure, Instant start, Instant end) {
    UserDefinedAppointment userDefinedAppointment = procedure.getUserDefinedAppointment();
    if (userDefinedAppointment == null) {
      return true;
    }
    return !(Objects.equals(userDefinedAppointment.getAppointmentStart(), start)
        && Objects.equals(userDefinedAppointment.getAppointmentEnd(), end));
  }

  public void bookAppointmentFromAppointmentBlock(
      ProstituteProtectionProcedure procedure, AppointmentType type, Instant start, Instant end) {
    procedure.setUserDefinedAppointment(null);
    procedure.setConsultantId(null);
    deleteAppointmentCalendarEvent(procedure);
    appointmentBlockSlotUtil.updateAppointment(type, null, null, procedure, start, end);
  }

  public void removeAppointmentFromAppointmentBlock(ProstituteProtectionProcedure procedure) {
    appointmentBlockSlotUtil.removeAppointment(procedure);
  }

  public void removeUserDefinedAppointment(ProstituteProtectionProcedure procedure) {
    procedure.setUserDefinedAppointment(null);
    deleteAppointmentCalendarEvent(procedure);
  }

  @Override
  public Clock getClock() {
    return clock;
  }

  @Override
  protected List<ProstituteProtectionProcedure> resolveEntitiesWithAppointments(
      List<Appointment> appointments) {
    return prostituteProtectionProcedureRepository.findByAppointmentIn(appointments);
  }

  @Override
  protected Map<ProstituteProtectionProcedure, String> getInformationForAppointmentOverview(
      List<ProstituteProtectionProcedure> entities) {
    return entities.stream()
        .collect(StreamUtil.toLinkedHashMap(entity -> entity, e -> e.getPersonalData().getAlias()));
  }

  @Override
  protected UUID getProcedureId(ProstituteProtectionProcedure entity) {
    return entity.getExternalId();
  }

  private void createAppointmentCalendarEvent(
      ProstituteProtectionProcedure procedure, Instant start, Instant end) {
    GetUserCalendarsResponse userCalendarsResponse =
        calendarApi.getUserCalendars(
            new GetUserCalendarsRequest(List.of(procedure.getConsultantId())));
    List<UUID> calendarIds =
        userCalendarsResponse.userCalendars().stream().map(UserCalendar::calendarId).toList();
    Assert.notEmpty(
        calendarIds, "No calendar(s) found for consultant with ID " + procedure.getConsultantId());
    DetailedEvent appointmentEventData =
        calendarEventApi.addBusinessCaseEvent(
            new BusinessCaseEventRequest(calendarIds, new EventTimeData(start, end, false)));
    procedure.setCalendarEventId(appointmentEventData.id());
  }

  private void deleteAppointmentCalendarEvent(ProstituteProtectionProcedure procedure) {
    UUID calendarEventId = procedure.getCalendarEventId();
    if (calendarEventId != null) {
      calendarEventApi.deleteBusinessCaseEvent(calendarEventId);
      procedure.setCalendarEventId(null);
    }
  }
}
