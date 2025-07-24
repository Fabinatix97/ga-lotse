/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.lib.appointmentblock.api.AppointmentBlockSlotDto;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Service;

@Service
public abstract class AbstractAppointmentService<T extends EntityWithAppointment> {
  protected abstract Clock getClock();

  public Map<Appointment, AppointmentBlockSlotDto> getAppointmentBlockSlotsForAppointments(
      List<Appointment> appointments) {
    List<T> entities = resolveEntitiesWithAppointments(appointments);

    Map<T, String> entityToInformation = getEntityToInformation(entities);

    Map<Appointment, AppointmentBlockSlotDto> mappedAppointments =
        entities.stream()
            .collect(
                Collectors.toMap(
                    EntityWithAppointment::getAppointment,
                    entity ->
                        createAppointmentBlockSlotDto(entity, entityToInformation.get(entity)),
                    (s1, s2) -> s1));

    return appointments.stream()
        .collect(
            Collectors.toMap(
                appointment -> appointment,
                appointment ->
                    mappedAppointments.getOrDefault(
                        appointment, createAppointmentBlockSlotDto(appointment)),
                (a1, a2) -> a1));
  }

  protected abstract List<T> resolveEntitiesWithAppointments(List<Appointment> appointments);

  private Map<T, String> getEntityToInformation(List<T> entities) {
    List<T> entitiesNeedingInformation =
        entities.stream().filter(entity -> isWithDetails(entity.getAppointment())).toList();
    if (entitiesNeedingInformation.isEmpty()) {
      return Map.of();
    }
    return getInformationForAppointmentOverview(entitiesNeedingInformation);
  }

  private boolean isWithDetails(Appointment appointment) {
    return !appointment.getAppointmentEnd().isBefore(getStartOfWeek());
  }

  Instant getStartOfWeek() {
    Clock clock = getClock();
    LocalDate startOfWeek =
        Instant.now(clock)
            .atZone(clock.getZone())
            .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
            .toLocalDate();
    return startOfWeek.atStartOfDay(clock.getZone()).toInstant();
  }

  protected abstract Map<T, String> getInformationForAppointmentOverview(List<T> entities);

  private AppointmentBlockSlotDto createAppointmentBlockSlotDto(T entity, String information) {
    Appointment appointment = entity.getAppointment();
    if (isWithDetails(appointment)) {
      return new AppointmentBlockSlotDto(
          appointment.getAppointmentStart(),
          appointment.getAppointmentEnd(),
          true,
          AppointmentTypeMapper.toInterfaceType(appointment.getType()),
          appointment.getId(),
          Strings.isEmpty(information) ? null : information,
          getProcedureId(entity));
    } else {
      return createAppointmentBlockSlotDto(appointment);
    }
  }

  private AppointmentBlockSlotDto createAppointmentBlockSlotDto(Appointment appointment) {
    return new AppointmentBlockSlotDto(
        appointment.getAppointmentStart(),
        appointment.getAppointmentEnd(),
        true,
        AppointmentTypeMapper.toInterfaceType(appointment.getType()),
        appointment.getId(),
        null,
        null);
  }

  protected abstract UUID getProcedureId(T entity);
}
