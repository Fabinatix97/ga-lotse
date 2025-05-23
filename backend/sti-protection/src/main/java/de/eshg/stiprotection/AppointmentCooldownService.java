/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup;
import de.eshg.stiprotection.persistence.data.AppointmentData;
import de.eshg.stiprotection.persistence.db.AppointmentCooldown;
import de.eshg.stiprotection.persistence.db.AppointmentCooldownRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

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
    AppointmentType type = getAppointmentType(appointment);
    if (cooldownRepository
        .findByAppointmentStartAndAppointmentEndAndType(appointmentStart, appointmentEnd, type)
        .isPresent()) {
      return;
    }
    cooldownRepository.save(new AppointmentCooldown(appointmentStart, appointmentEnd, type));
  }

  private static AppointmentType getAppointmentType(Appointment appointment) {
    Assert.notNull(appointment, "Appointment must not be null");
    return Optional.of(appointment)
        .map(Appointment::getAppointmentBlock)
        .map(AppointmentBlock::getAppointmentBlockGroup)
        .map(AppointmentBlockGroup::getType)
        .orElseThrow(
            () ->
                new IllegalArgumentException(
                    "Appointment must be from a block of a group with an appointment type present"));
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
        appointment.getAppointmentStart(),
        appointment.getAppointmentEnd(),
        getAppointmentType(appointment));
  }

  public void removeAppointmentCooldown(
      Instant appointmentStart, Instant appointmentEnd, AppointmentType type) {
    cooldownRepository
        .findByAppointmentStartAndAppointmentEndAndType(appointmentStart, appointmentEnd, type)
        .ifPresent(cooldownRepository::delete);
  }
}
