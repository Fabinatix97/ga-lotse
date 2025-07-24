/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import static de.eshg.lib.appointmentblock.persistence.AppointmentType.PROOF_SUBMISSION;
import static de.eshg.measlesprotection.persistence.support.MeaslesProtectionSystemProgressEntryType.APPOINTMENT_BOOKED;
import static de.eshg.measlesprotection.persistence.support.MeaslesProtectionSystemProgressEntryType.APPOINTMENT_DELETED;
import static de.eshg.measlesprotection.persistence.support.MeaslesProtectionSystemProgressEntryType.APPOINTMENT_REBOOKED;

import de.eshg.base.calendar.CalendarApi;
import de.eshg.base.calendar.CalendarEventApi;
import de.eshg.base.calendar.api.BusinessCaseEventRequest;
import de.eshg.base.calendar.api.EventTimeData;
import de.eshg.base.calendar.api.EventWithTimeData;
import de.eshg.base.calendar.api.GetBlockingEventsOfCalendarsRequest;
import de.eshg.base.calendar.api.GetBlockingEventsOfCalendarsResponse;
import de.eshg.base.calendar.api.TimeRange;
import de.eshg.base.calendar.api.UserCalendar;
import de.eshg.lib.appointmentblock.AbstractAppointmentService;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.model.AppointmentBlockSlot;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockRepository;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.measlesprotection.config.DateTimeConstants;
import de.eshg.measlesprotection.persistence.centralfile.PersonClient;
import de.eshg.measlesprotection.persistence.centralfile.ProcedureWithPersonDetailsData;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedureRepository;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.time.Instant;
import java.time.Period;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppointmentService extends AbstractAppointmentService<MeaslesProtectionProcedure> {

  public static final int MAX_DAYS = 45;

  private final Clock clock;
  private final CalendarApi calendarApi;
  private final CalendarEventApi calendarEventApi;
  private final ProcedureFinder procedureFinder;
  private final AppointmentBlockRepository appointmentBlockRepository;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final MeaslesProtectionProcedureRepository measlesProtectionProcedureRepository;
  private final PersonClient personClient;

  public AppointmentService(
      Clock clock,
      CalendarApi calendarApi,
      CalendarEventApi calendarEventApi,
      ProcedureFinder procedureFinder,
      AppointmentBlockRepository appointmentBlockRepository,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      MeaslesProtectionProcedureRepository measlesProtectionProcedureRepository,
      PersonClient personClient) {
    this.clock = clock;
    this.calendarApi = calendarApi;
    this.calendarEventApi = calendarEventApi;
    this.procedureFinder = procedureFinder;
    this.appointmentBlockRepository = appointmentBlockRepository;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.measlesProtectionProcedureRepository = measlesProtectionProcedureRepository;
    this.personClient = personClient;
  }

  @Override
  public Clock getClock() {
    return clock;
  }

  @Transactional(readOnly = true)
  public List<AppointmentDto> getFreeAppointments() {
    Instant start = Instant.now(clock);
    Instant end = start.plus(Period.ofDays(MAX_DAYS));

    List<AppointmentBlock> appointmentBlocks =
        appointmentBlockRepository
            .findBlockByAppointmentTypeAndLocationAndAppointmentBlockEndGreaterThan(
                PROOF_SUBMISSION, null, null, start);

    Set<UUID> currentUserEvents = currentUserEvents(start, end);
    List<AppointmentBlock> currentUserBlocks =
        filterCurrentUserBlocks(appointmentBlocks, currentUserEvents);

    return appointmentBlockSlotUtil
        .calculateFreeAppointmentBlockSlotsForType(currentUserBlocks, PROOF_SUBMISSION)
        .values()
        .stream()
        .flatMap(Collection::stream)
        .distinct()
        .filter(slot -> slot.start().isAfter(start))
        .sorted(Comparator.comparing(AppointmentBlockSlot::start))
        .map(slot -> new AppointmentDto(slot.start(), slot.end()))
        .toList();
  }

  private static List<AppointmentBlock> filterCurrentUserBlocks(
      List<AppointmentBlock> appointmentBlocks, Collection<UUID> currentUserEvents) {
    return appointmentBlocks.stream()
        .filter(b -> currentUserEvents.contains(b.getCalendarEventId()))
        .toList();
  }

  private Set<UUID> currentUserEvents(Instant start, Instant end) {
    return getBlockingEventsOfCurrentUsersCalendarInTimeRange(start, end)
        .map(EventWithTimeData::id)
        .collect(Collectors.toSet());
  }

  @Transactional
  public void bookAppointment(UUID procedureId, Instant start, Instant end) {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(procedureId);
    Appointment appointment = procedure.getAppointment();

    if (appointment == null) {
      bookAppointment(procedure, start, end);
      addBookAppointmentProgressEntry(
          procedure,
          APPOINTMENT_BOOKED.name(),
          "Der Termin wurde für den %s von %s bis %s Uhr gebucht.",
          start,
          end);
    } else if (!isSameAppointmentSchedule(appointment, start, end)) {
      rebookAppointment(procedure, appointment, start, end);
      addBookAppointmentProgressEntry(
          procedure,
          APPOINTMENT_REBOOKED.name(),
          "Der Termin wurde verschoben auf den %s von %s bis %s Uhr.",
          start,
          end);
    }
  }

  private void bookAppointment(MeaslesProtectionProcedure procedure, Instant start, Instant end) {
    appointmentBlockSlotUtil.updateAppointment(PROOF_SUBMISSION, null, null, procedure, start, end);

    UserCalendar currentUserCalendar = calendarApi.getCurrentUserCalendar();
    calendarEventApi.addBusinessCaseEvent(
        new BusinessCaseEventRequest(
            List.of(currentUserCalendar.calendarId()), new EventTimeData(start, end, false)));
  }

  private void rebookAppointment(
      MeaslesProtectionProcedure procedure, Appointment appointment, Instant start, Instant end) {
    deleteAppointment(procedure, appointment);
    bookAppointment(procedure, start, end);
  }

  private void addBookAppointmentProgressEntry(
      MeaslesProtectionProcedure procedure,
      String messageType,
      String message,
      Instant start,
      Instant end) {
    ZonedDateTime zonedStart = start.atZone(clock.getZone());
    ZonedDateTime zonedEnd = end.atZone(clock.getZone());
    SystemProgressEntry bookAppointmentProgressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            messageType,
            message.formatted(
                zonedStart.format(DateTimeConstants.DATE_FORMAT_DE),
                zonedStart.format(DateTimeConstants.TIME_FORMAT_DE),
                zonedEnd.format(DateTimeConstants.TIME_FORMAT_DE)),
            TriggerType.SYSTEM_AUTOMATIC);
    bookAppointmentProgressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(bookAppointmentProgressEntry);
  }

  @Transactional
  public void deleteAppointment(UUID procedureId) {
    MeaslesProtectionProcedure procedure = procedureFinder.findProcedureByExternalId(procedureId);
    Appointment appointment = procedure.getAppointment();
    deleteAppointment(procedure, appointment);

    SystemProgressEntry deleteAppointmentProgressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            APPOINTMENT_DELETED.name(), "Der Termin wurde gelöscht.", TriggerType.SYSTEM_AUTOMATIC);
    deleteAppointmentProgressEntry.setProcedureId(procedure.getId());
    procedure.addProgressEntry(deleteAppointmentProgressEntry);
  }

  private void deleteAppointment(MeaslesProtectionProcedure procedure, Appointment appointment) {
    UUID eventId = findAppointmentEvent(appointment);
    procedure.setAppointment(null);
    calendarEventApi.deleteBusinessCaseEvent(eventId);
  }

  private UUID findAppointmentEvent(Appointment appointment) {
    Instant start = appointment.getAppointmentStart();
    Instant end = appointment.getAppointmentEnd();
    return getBlockingEventsOfCurrentUsersCalendarInTimeRange(start, end)
        .filter(
            event -> event.timeData().start().equals(start) && event.timeData().end().equals(end))
        .map(EventWithTimeData::id)
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Calendar event not found"));
  }

  private static boolean isSameAppointmentSchedule(
      Appointment appointment, Instant start, Instant end) {

    if (appointment == null) {
      return false;
    }
    return appointment.getAppointmentStart().equals(start)
        && appointment.getAppointmentEnd().equals(end);
  }

  private Stream<EventWithTimeData> getBlockingEventsOfCurrentUsersCalendarInTimeRange(
      Instant start, Instant end) {
    UserCalendar currentUserCalendar = calendarApi.getCurrentUserCalendar();
    GetBlockingEventsOfCalendarsResponse blockingEventsOfCalendars =
        calendarEventApi.getBlockingEventsOfCalendars(
            new GetBlockingEventsOfCalendarsRequest(
                List.of(currentUserCalendar.calendarId()), List.of(new TimeRange(start, end))));

    return blockingEventsOfCalendars.calendarsWithBlockingEvents().stream()
        .flatMap(calendars -> calendars.events().stream());
  }

  @Override
  protected List<MeaslesProtectionProcedure> resolveEntitiesWithAppointments(
      List<Appointment> appointments) {
    return measlesProtectionProcedureRepository.findByAppointmentIn(appointments);
  }

  @Override
  protected Map<MeaslesProtectionProcedure, String> getInformationForAppointmentOverview(
      List<MeaslesProtectionProcedure> entities) {
    return personClient
        .augmentWithPersonDetails(entities, false)
        .collect(
            Collectors.toMap(
                ProcedureWithPersonDetailsData::procedure,
                data ->
                    data.personDetails() == null
                        ? ""
                        : "%s %s"
                            .formatted(
                                data.personDetails().firstName(),
                                data.personDetails().lastName())));
  }

  @Override
  protected UUID getProcedureId(MeaslesProtectionProcedure entity) {
    return entity.getExternalId();
  }
}
