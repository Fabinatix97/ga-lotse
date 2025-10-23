/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.appointment;

import static de.eshg.lib.appointmentblock.api.AppointmentTypeDto.OFFICIAL_MEDICAL_SERVICE_LONG;
import static de.eshg.lib.appointmentblock.api.AppointmentTypeDto.OFFICIAL_MEDICAL_SERVICE_SHORT;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.lib.appointmentblock.AbstractAppointmentService;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.officialmedicalservice.appointment.api.BookingInfoDto;
import de.eshg.officialmedicalservice.appointment.api.BookingTypeDto;
import de.eshg.officialmedicalservice.appointment.api.PostOmsAppointmentRequest;
import de.eshg.officialmedicalservice.appointment.persistence.OmsAppointmentRepository;
import de.eshg.officialmedicalservice.appointment.persistence.entity.AppointmentState;
import de.eshg.officialmedicalservice.appointment.persistence.entity.BookingState;
import de.eshg.officialmedicalservice.appointment.persistence.entity.BookingType;
import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointment;
import de.eshg.officialmedicalservice.config.OmsAppointmentStandardDurationService;
import de.eshg.officialmedicalservice.notification.NotificationService;
import de.eshg.officialmedicalservice.person.PersonClient;
import de.eshg.officialmedicalservice.person.PersonMapper;
import de.eshg.officialmedicalservice.procedure.ProgressEntryService;
import de.eshg.officialmedicalservice.procedure.api.AffectedPersonDto;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.officialmedicalservice.procedure.persistence.entity.Person;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OmsAppointmentService extends AbstractAppointmentService<OmsAppointment> {
  private final Clock clock;
  private final OmsProcedureRepository omsProcedureRepository;
  private final OmsAppointmentRepository omsAppointmentRepository;
  private final OmsAppointmentMapper omsAppointmentMapper;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final ProgressEntryService progressEntryService;
  private final PersonClient personClient;
  private final NotificationService notificationService;
  private final OmsAppointmentStandardDurationService appointmentStandardDurationService;

  private static final List<AppointmentTypeDto> supportedAppointmentTypes =
      List.of(OFFICIAL_MEDICAL_SERVICE_SHORT, OFFICIAL_MEDICAL_SERVICE_LONG);
  private static final DateTimeFormatter dateFormatter =
      DateTimeFormatter.ofPattern("dd.MM.yyyy", Locale.GERMANY);
  private static final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

  public OmsAppointmentService(
      Clock clock,
      OmsProcedureRepository omsProcedureRepository,
      OmsAppointmentRepository omsAppointmentRepository,
      OmsAppointmentMapper omsAppointmentMapper,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      ProgressEntryService progressEntryService,
      PersonClient personClient,
      NotificationService notificationService,
      OmsAppointmentStandardDurationService appointmentStandardDurationService) {
    this.clock = clock;
    this.omsProcedureRepository = omsProcedureRepository;
    this.omsAppointmentRepository = omsAppointmentRepository;
    this.omsAppointmentMapper = omsAppointmentMapper;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.progressEntryService = progressEntryService;
    this.personClient = personClient;
    this.notificationService = notificationService;
    this.appointmentStandardDurationService = appointmentStandardDurationService;
  }

  @Override
  public Clock getClock() {
    return clock;
  }

  @Transactional
  public UUID addAppointmentEmployee(UUID externalId, PostOmsAppointmentRequest request) {
    OmsProcedure procedure = loadOmsProcedure(externalId);

    // validate
    if (procedure.isFinalized()) {
      throw new BadRequestException("Procedure already closed");
    }
    if (!supportedAppointmentTypes.contains(request.appointmentType())) {
      throw new BadRequestException("Unsupported appointment type.");
    }

    if (procedureHasOpenAppointment(procedure)) {
      throw new BadRequestException("Procedure already has an open appointment");
    }

    AppointmentType appointmentType = omsAppointmentMapper.toDomainType(request.appointmentType());

    // create bookable appointment
    OmsAppointment appointment = new OmsAppointment(appointmentType);
    appointment.setProcedure(procedure);
    procedure.getAppointments().add(appointment);

    // and book it
    BookingInfoDto bookingInfo = request.bookingInfo();
    if (bookingInfo != null) {
      processBooking(bookingInfo, appointment);
    }

    omsAppointmentRepository.save(appointment);

    Person person = procedure.findAffectedPerson();
    AffectedPersonDto affectedPersonDto =
        PersonMapper.mapToAffectedPersonDto(
            personClient.getPersonFileState(person.getCentralFileStateId()), person.getVersion());
    if (bookingInfo != null) {
      progressEntryService.createProgressEntryForAddingAppointmentWithBooking(procedure, request);

      if (procedure.getProcedureStatus() == ProcedureStatus.OPEN
          && procedure.isSendEmailNotifications()) {
        ZonedDateTime zonedDateTime = appointment.getStart().atZone(clock.getZone());
        String appointmentDate = zonedDateTime.format(dateFormatter);
        String appointmentTime = zonedDateTime.format(timeFormatter);
        String appointmentDuration = appointment.getDuration() + " Minuten";
        notificationService.notifyNewAppointmentWithBooking(
            affectedPersonDto, appointmentDate, appointmentTime, appointmentDuration);
      }
    } else {
      progressEntryService.createProgressEntryForAddingSelfBookingAppointment(procedure);
      if (procedure.getProcedureStatus() == ProcedureStatus.OPEN
          && procedure.isSendEmailNotifications()) {
        notificationService.notifyNewAppointmentSelfBooking(
            affectedPersonDto,
            appointmentStandardDurationService.getStandardDuration(appointmentType).toMinutes()
                + " Minuten");
      }
    }

    return appointment.getExternalId();
  }

  @Transactional
  public void addAppointmentCitizen(OmsProcedure procedure, PostOmsAppointmentRequest request) {
    if (procedure.isFinalized()) {
      throw new BadRequestException("Procedure already closed");
    }
    if (!supportedAppointmentTypes.contains(request.appointmentType())) {
      throw new BadRequestException("Unsupported appointment type.");
    }

    AppointmentType appointmentType = omsAppointmentMapper.toDomainType(request.appointmentType());

    OmsAppointment appointment = new OmsAppointment(appointmentType);
    appointment.setProcedure(procedure);
    procedure.getAppointments().add(appointment);

    processBooking(request.bookingInfo(), appointment);

    omsAppointmentRepository.save(appointment);
  }

  @Transactional
  public void bookAppointmentCitizen(UUID appointmentId, AppointmentDto appointmentDto) {
    OmsAppointment appointment = loadAppointment(appointmentId);

    if (appointment.getAppointmentState() == AppointmentState.CLOSED) {
      throw new BadRequestException("Appointment is already closed.");
    }

    Integer duration =
        (int) Duration.between(appointmentDto.start(), appointmentDto.end()).toMinutes();
    BookingInfoDto bookingInfo =
        new BookingInfoDto(BookingTypeDto.APPOINTMENT_BLOCK, appointmentDto.start(), duration);

    Person person = appointment.getProcedure().findAffectedPerson();
    AffectedPersonDto affectedPersonDto =
        PersonMapper.mapToAffectedPersonDto(
            personClient.getPersonFileState(person.getCentralFileStateId()), person.getVersion());
    if (appointment.getBookingState() == BookingState.BOOKED) {
      int remainingBookings = appointment.getBookingsRemaining();

      if (remainingBookings == 0) {
        throw new BadRequestException("Bookings remaining is zero");
      }

      Instant oldAppointmentStart = appointment.getStart();
      ZonedDateTime oldZonedDateTime = oldAppointmentStart.atZone(clock.getZone());
      String oldAppointmentDate = oldZonedDateTime.format(dateFormatter);
      String oldAppointmentTime = oldZonedDateTime.format(timeFormatter);
      appointment.setStart(appointmentDto.start());
      appointment.setDuration(duration);
      appointment.setBookingType(BookingType.APPOINTMENT_BLOCK);
      appointment.setBookingsRemaining(remainingBookings - 1);

      ZonedDateTime newZonedDateTime = appointmentDto.start().atZone(clock.getZone());
      String newAppointmentDate = newZonedDateTime.format(dateFormatter);
      String newAppointmentTime = newZonedDateTime.format(timeFormatter);
      notificationService.notifyRebookAppointmentCp(
          affectedPersonDto,
          oldAppointmentDate,
          oldAppointmentTime,
          newAppointmentDate,
          newAppointmentTime);

      progressEntryService.createProgressEntryForRebookedAppointmentByCitizen(
          appointment.getProcedure(), oldAppointmentStart, appointmentDto.start());
    } else if (List.of(BookingState.BOOKABLE, BookingState.CANCELLED)
        .contains(appointment.getBookingState())) {
      appointment.setStart(appointmentDto.start());
      appointment.setDuration(duration);
      appointment.setBookingType(BookingType.APPOINTMENT_BLOCK);
      appointment.setBookingState(BookingState.BOOKED);

      ZonedDateTime zonedDateTime = appointment.getStart().atZone(clock.getZone());
      String appointmentDate = zonedDateTime.format(dateFormatter);
      String appointmentTime = zonedDateTime.format(timeFormatter);
      notificationService.notifyBookAppointmentCp(
          affectedPersonDto, appointmentDate, appointmentTime);

      progressEntryService.createProgressEntryForBookingAppointmentByCitizen(
          appointment.getProcedure(), appointmentDto.start(), TriggerType.CITIZEN);
    }

    processBooking(bookingInfo, appointment);
  }

  @Transactional
  public void bookAppointmentEmployee(UUID appointmentId, BookingInfoDto request) {
    OmsAppointment appointment = loadAppointment(appointmentId);
    OmsProcedure procedure = appointment.getProcedure();
    if (procedure.isFinalized()) {
      throw new BadRequestException("Procedure is already closed.");
    }
    if (AppointmentState.CLOSED == appointment.getAppointmentState()) {
      throw new BadRequestException("Appointment is already closed.");
    }
    if (BookingState.WITHDRAWN == appointment.getBookingState()) {
      throw new BadRequestException("Appointment is withdrawn");
    }

    Person person = procedure.findAffectedPerson();
    AffectedPersonDto affectedPersonDto =
        PersonMapper.mapToAffectedPersonDto(
            personClient.getPersonFileState(person.getCentralFileStateId()), person.getVersion());
    ZonedDateTime newZonedDateTime = request.start().atZone(clock.getZone());
    String newAppointmentDate = newZonedDateTime.format(dateFormatter);
    String newAppointmentTime = newZonedDateTime.format(timeFormatter);
    if (BookingState.BOOKED == appointment.getBookingState()) {
      progressEntryService.createProgressEntryForRebookedAppointment(
          procedure, appointment, request);

      if (procedure.getProcedureStatus() == ProcedureStatus.OPEN
          && procedure.isSendEmailNotifications()) {
        ZonedDateTime oldZonedDateTime = appointment.getStart().atZone(clock.getZone());
        String oldAppointmentDate = oldZonedDateTime.format(dateFormatter);
        String oldAppointmentTime = oldZonedDateTime.format(timeFormatter);
        notificationService.notifyRebookAppointment(
            affectedPersonDto,
            oldAppointmentDate,
            oldAppointmentTime,
            newAppointmentDate,
            newAppointmentTime);
      }
    } else {
      progressEntryService.createProgressEntryForBookingAppointment(procedure, request);

      if (procedure.getProcedureStatus() == ProcedureStatus.OPEN
          && procedure.isSendEmailNotifications()) {
        String appointmentDuration = request.duration() + " Minuten";
        notificationService.notifyNewAppointmentWithBooking(
            affectedPersonDto, newAppointmentDate, newAppointmentTime, appointmentDuration);
      }
    }

    processBooking(request, appointment);
  }

  @Transactional
  public void cancelAppointmentEmployee(UUID appointmentId, String reasonForRejection) {
    OmsAppointment appointment = loadAppointment(appointmentId);

    OmsProcedure procedure = appointment.getProcedure();
    if (procedure.isFinalized()) {
      throw new BadRequestException("Procedure is already closed.");
    }
    if (AppointmentState.CLOSED == appointment.getAppointmentState()) {
      throw new BadRequestException("Appointment is already closed.");
    }
    if (BookingState.BOOKED != appointment.getBookingState()) {
      throw new BadRequestException("Appointment is not booked");
    }

    appointment.setBookingState(BookingState.CANCELLED);
    appointment.setBookingType(null);
    appointment.setDuration(null);
    appointment.setAppointment(null); // to unlock appointment block
    appointment.setReasonForRejection(reasonForRejection);
    progressEntryService.createProgressEntryForCancelingAppointment(procedure, appointment);

    if (procedure.getProcedureStatus() == ProcedureStatus.OPEN
        && procedure.isSendEmailNotifications()) {
      Person person = procedure.findAffectedPerson();
      AffectedPersonDto affectedPersonDto =
          PersonMapper.mapToAffectedPersonDto(
              personClient.getPersonFileState(person.getCentralFileStateId()), person.getVersion());
      ZonedDateTime zonedDateTime = appointment.getStart().atZone(clock.getZone());
      String appointmentDate = zonedDateTime.format(dateFormatter);
      String appointmentTime = zonedDateTime.format(timeFormatter);
      notificationService.notifyCancelAppointment(
          affectedPersonDto, appointmentDate, appointmentTime, reasonForRejection);
    }
  }

  @Transactional
  public void cancelAppointmentCitizen(UUID appointmentId) {
    OmsAppointment appointment = loadAppointment(appointmentId);

    if (AppointmentState.CLOSED == appointment.getAppointmentState()) {
      throw new BadRequestException("Appointment is already closed.");
    }
    if (BookingState.BOOKED != appointment.getBookingState()) {
      throw new BadRequestException("Appointment is not booked");
    }

    ZonedDateTime zonedDateTime = appointment.getStart().atZone(clock.getZone());
    String appointmentDate = zonedDateTime.format(dateFormatter);
    String appointmentTime = zonedDateTime.format(timeFormatter);

    appointment.setBookingState(BookingState.CANCELLED);
    appointment.setAppointment(null); // to unlock appointment block

    Person person = appointment.getProcedure().findAffectedPerson();
    AffectedPersonDto affectedPersonDto =
        PersonMapper.mapToAffectedPersonDto(
            personClient.getPersonFileState(person.getCentralFileStateId()), person.getVersion());
    notificationService.notifyCancelAppointmentCp(
        affectedPersonDto, appointmentDate, appointmentTime);

    progressEntryService.createProgressEntryForCancelingAppointmentByCitizen(
        appointment.getProcedure(), appointment.getStart());
  }

  @Transactional
  public void closeAppointmentEmployee(UUID appointmentId) {
    OmsAppointment appointment = loadAppointment(appointmentId);
    OmsProcedure procedure = appointment.getProcedure();

    if (procedure.isFinalized()) {
      throw new BadRequestException("Procedure is already closed.");
    }
    if (AppointmentState.CLOSED == appointment.getAppointmentState()) {
      throw new BadRequestException("Appointment is already closed.");
    }

    if (BookingState.BOOKABLE == appointment.getBookingState()) {
      appointment.setBookingState(BookingState.WITHDRAWN);

      progressEntryService.createProgressEntryForWithdrawingAppointmentOption(procedure);
      if (procedure.getProcedureStatus() == ProcedureStatus.OPEN
          && procedure.isSendEmailNotifications()) {
        Person person = procedure.findAffectedPerson();
        AffectedPersonDto affectedPersonDto =
            PersonMapper.mapToAffectedPersonDto(
                personClient.getPersonFileState(person.getCentralFileStateId()),
                person.getVersion());
        notificationService.notifyCloseAppointment(affectedPersonDto);
      }
    } else {
      progressEntryService.createProgressEntryForClosingAppointment(procedure, appointment);
    }

    appointment.setAppointmentState(AppointmentState.CLOSED);
  }

  private boolean procedureHasOpenAppointment(OmsProcedure omsProcedure) {
    return omsProcedure.getAppointments().stream()
        .anyMatch(appointment -> appointment.getAppointmentState() == AppointmentState.OPEN);
  }

  private void processBooking(BookingInfoDto bookingInfo, OmsAppointment appointment) {
    BookingTypeDto bookingTypeDto = bookingInfo.bookingType();
    Instant start = bookingInfo.start();
    Integer duration = bookingInfo.duration();

    appointment.setBookingState(BookingState.BOOKED);
    appointment.setBookingType(omsAppointmentMapper.toDomainType(bookingTypeDto));
    appointment.setStart(start);
    appointment.setDuration(duration);
    appointment.setReasonForRejection(null);

    if (BookingTypeDto.APPOINTMENT_BLOCK.equals(bookingTypeDto)) {
      Instant end = start.plus(Duration.ofMinutes(duration));
      appointmentBlockSlotUtil.updateAppointment(
          appointment.getAppointmentType(),
          null,
          appointment.getProcedure().getPhysicianId(),
          appointment,
          start,
          end);
    } else {
      // in case we rebook from appointment block to user defined...
      // ...we need to unlock the used appointment slot
      appointment.setAppointment(null);
    }
  }

  private OmsProcedure loadOmsProcedure(UUID externalId) {
    return omsProcedureRepository
        .findByExternalId(externalId)
        .orElseThrow(() -> new NotFoundException("Procedure not found"));
  }

  private OmsAppointment loadAppointment(UUID appointmentId) {
    return omsAppointmentRepository
        .findById(appointmentId)
        .orElseThrow(() -> new NotFoundException("Appointment not found"));
  }

  @Override
  protected List<OmsAppointment> resolveEntitiesWithAppointments(List<Appointment> appointments) {
    return omsAppointmentRepository.findByAppointmentIn(appointments);
  }

  @Override
  protected Map<OmsAppointment, String> getInformationForAppointmentOverview(
      List<OmsAppointment> entities) {
    Map<OmsAppointment, UUID> omsAppointmentToCentralFileId = new HashMap<>();
    entities.forEach(
        entity -> {
          Person affectedPerson = entity.getProcedure().findAffectedPerson();
          if (affectedPerson != null) {
            omsAppointmentToCentralFileId.put(entity, affectedPerson.getCentralFileStateId());
          }
        });
    Map<UUID, GetPersonFileStateResponse> centralFileIdToResponse =
        personClient
            .getPersonFileStates(
                new GetPersonFileStatesRequest(
                    omsAppointmentToCentralFileId.values().stream().distinct().toList()))
            .personFileStates()
            .stream()
            .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));

    return entities.stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                Function.identity(),
                entity -> {
                  UUID centralFileId = omsAppointmentToCentralFileId.get(entity);
                  if (centralFileId == null) {
                    return "";
                  }
                  GetPersonFileStateResponse personFileStateResponse =
                      centralFileIdToResponse.get(centralFileId);
                  if (personFileStateResponse == null) {
                    return "";
                  }
                  return "%s %s"
                      .formatted(
                          personFileStateResponse.firstName(), personFileStateResponse.lastName());
                }));
  }

  @Override
  protected UUID getProcedureId(OmsAppointment entity) {
    return entity.getProcedure().getExternalId();
  }
}
