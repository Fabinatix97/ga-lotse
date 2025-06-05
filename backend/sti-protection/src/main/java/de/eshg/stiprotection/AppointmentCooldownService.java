/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.stiprotection.persistence.data.AppointmentData;
import de.eshg.stiprotection.persistence.db.AppointmentCooldown;
import de.eshg.stiprotection.persistence.db.AppointmentCooldownRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AppointmentCooldownService {
  private final AppointmentCooldownRepository cooldownRepository;

  public AppointmentCooldownService(AppointmentCooldownRepository cooldownRepository) {
    this.cooldownRepository = cooldownRepository;
  }

  public List<AppointmentCooldown> getAppointmentsOnCooldown() {
    return cooldownRepository.findAll();
  }

  public void setAppointmentOnCooldown(Appointment appointment) {
    if (appointment == null) {
      return;
    }
    Instant appointmentStart = appointment.getAppointmentStart();
    Instant appointmentEnd = appointment.getAppointmentEnd();
    AppointmentType type = appointment.getType();
    if (cooldownRepository
        .findByAppointmentStartAndAppointmentEndAndType(appointmentStart, appointmentEnd, type)
        .isPresent()) {
      return;
    }
    cooldownRepository.save(new AppointmentCooldown(appointmentStart, appointmentEnd, type));
  }

  public boolean isAppointmentSlotOnCooldown(AppointmentData appointmentData) {
    Instant start = appointmentData.appointmentStart();
    Instant end = start.plus(Duration.ofMinutes(appointmentData.durationInMinutes()));
    return cooldownRepository
        .findByAppointmentStartAndAppointmentEndAndType(
            start, end, appointmentData.appointmentType())
        .isPresent();
  }

  public void removeAppointmentCooldown(Appointment appointment) {
    if (appointment == null) {
      return;
    }
    removeAppointmentCooldown(
        appointment.getAppointmentStart(), appointment.getAppointmentEnd(), appointment.getType());
  }

  public void removeAppointmentCooldown(
      Instant appointmentStart, Instant appointmentEnd, AppointmentType type) {
    cooldownRepository
        .findByAppointmentStartAndAppointmentEndAndType(appointmentStart, appointmentEnd, type)
        .ifPresent(cooldownRepository::delete);
  }
}
