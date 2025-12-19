/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.appointmentblock.AbstractAppointmentService;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
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
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ProstituteProtectionAppointmentService
    extends AbstractAppointmentService<ProstituteProtectionProcedure> {
  private final Clock clock;
  private final ProstituteProtectionProcedureRepository prostituteProtectionProcedureRepository;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;

  public ProstituteProtectionAppointmentService(
      Clock clock,
      ProstituteProtectionProcedureRepository prostituteProtectionProcedureRepository,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil) {
    this.clock = clock;
    this.prostituteProtectionProcedureRepository = prostituteProtectionProcedureRepository;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
  }

  void bookAppointment(ProstituteProtectionProcedure procedure, AppointmentData appointment) {
    AppointmentType type = appointment.appointmentType();
    Instant start = appointment.appointmentStart();
    Instant end = start.plus(Duration.ofMinutes(appointment.durationInMinutes()));
    switch (appointment.appointmentBookingType()) {
      case APPOINTMENT_BLOCK -> bookAppointmentFromAppointmentBlock(procedure, type, start, end);
      case USER_DEFINED -> bookUserDefinedAppointment(procedure, start, end);
      default ->
          throw new BadRequestException(
              "Unsupported booking type: " + appointment.appointmentBookingType());
    }
  }

  private void bookUserDefinedAppointment(
      ProstituteProtectionProcedure procedure, Instant start, Instant end) {
    procedure.setAppointment(null);
    if (procedure.getUserDefinedAppointment() == null) {
      procedure.setUserDefinedAppointment(new UserDefinedAppointment());
    }
    procedure.getUserDefinedAppointment().setAppointmentStart(start);
    procedure.getUserDefinedAppointment().setAppointmentEnd(end);
  }

  private void bookAppointmentFromAppointmentBlock(
      ProstituteProtectionProcedure procedure, AppointmentType type, Instant start, Instant end) {
    procedure.setUserDefinedAppointment(null);
    appointmentBlockSlotUtil.updateAppointment(type, null, null, procedure, start, end);
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
}
