/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.appointment;

import static de.eshg.lib.appointmentblock.api.AppointmentTypeDto.OFFICIAL_MEDICAL_SERVICE_LONG;
import static de.eshg.lib.appointmentblock.api.AppointmentTypeDto.OFFICIAL_MEDICAL_SERVICE_SHORT;

import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.officialmedicalservice.appointment.api.BookingInfoDto;
import de.eshg.officialmedicalservice.appointment.api.BookingTypeDto;
import de.eshg.officialmedicalservice.appointment.api.PostOmsAppointmentRequest;
import de.eshg.officialmedicalservice.appointment.persistence.OmsAppointmentRepository;
import de.eshg.officialmedicalservice.appointment.persistence.entity.AppointmentState;
import de.eshg.officialmedicalservice.appointment.persistence.entity.BookingState;
import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointment;
import de.eshg.officialmedicalservice.procedure.ProgressEntryService;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedureRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OmsAppointmentService {
  private final OmsProcedureRepository omsProcedureRepository;
  private final OmsAppointmentRepository omsAppointmentRepository;
  private final OmsAppointmentMapper omsAppointmentMapper;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;

  private static final List<AppointmentTypeDto> supportedAppointmentTypes =
      List.of(OFFICIAL_MEDICAL_SERVICE_SHORT, OFFICIAL_MEDICAL_SERVICE_LONG);
  private final ProgressEntryService progressEntryService;

  public OmsAppointmentService(
      OmsProcedureRepository omsProcedureRepository,
      OmsAppointmentRepository omsAppointmentRepository,
      OmsAppointmentMapper omsAppointmentMapper,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      ProgressEntryService progressEntryService) {
    this.omsProcedureRepository = omsProcedureRepository;
    this.omsAppointmentRepository = omsAppointmentRepository;
    this.omsAppointmentMapper = omsAppointmentMapper;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.progressEntryService = progressEntryService;
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

    if (bookingInfo != null) {
      progressEntryService.createProgressEntryForAddingAppointmentWithBooking(procedure, request);
    } else {
      progressEntryService.createProgressEntryForAddingSelfBookingAppointment(procedure);
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
  public void bookAppointmentEmployee(UUID appointmentId, BookingInfoDto request) {
    OmsAppointment appointment = loadAppointment(appointmentId);
    if (appointment.getProcedure().isFinalized()) {
      throw new BadRequestException("Procedure is already closed.");
    }
    if (AppointmentState.CLOSED == appointment.getAppointmentState()) {
      throw new BadRequestException("Appointment is already closed.");
    }
    if (BookingState.WITHDRAWN == appointment.getBookingState()) {
      throw new BadRequestException("Appointment is withdrawn");
    }

    if (BookingState.BOOKED == appointment.getBookingState()) {
      progressEntryService.createProgressEntryForRebookedAppointment(
          appointment.getProcedure(), appointment, request);
    } else {
      progressEntryService.createProgressEntryForBookingAppointment(
          appointment.getProcedure(), request);
    }

    processBooking(request, appointment);
  }

  @Transactional
  public void cancelAppointmentEmployee(UUID appointmentId) {
    OmsAppointment appointment = loadAppointment(appointmentId);

    if (appointment.getProcedure().isFinalized()) {
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
    progressEntryService.createProgressEntryForCancelingAppointment(
        appointment.getProcedure(), appointment);
  }

  @Transactional
  public void closeAppointmentEmployee(UUID appointmentId) {
    OmsAppointment appointment = loadAppointment(appointmentId);

    if (appointment.getProcedure().isFinalized()) {
      throw new BadRequestException("Procedure is already closed.");
    }
    if (AppointmentState.CLOSED == appointment.getAppointmentState()) {
      throw new BadRequestException("Appointment is already closed.");
    }

    if (BookingState.BOOKABLE == appointment.getBookingState()) {
      appointment.setBookingState(BookingState.WITHDRAWN);

      progressEntryService.createProgressEntryForWithdrawingAppointmentOption(
          appointment.getProcedure());
    } else {
      progressEntryService.createProgressEntryForClosingAppointment(
          appointment.getProcedure(), appointment);
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
}
