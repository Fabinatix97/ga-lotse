/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.base.SortDirection;
import de.eshg.lib.appointmentblock.api.AppointmentBlockSortKey;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.GetAppointmentBlockDto;
import de.eshg.lib.appointmentblock.api.GetAppointmentBlockGroupDto;
import de.eshg.lib.appointmentblock.model.AppointmentBlockData;
import de.eshg.lib.appointmentblock.model.AppointmentBlockGroupData;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import java.time.Instant;
import org.springframework.data.domain.Sort;

public final class AppointmentMapper {
  private AppointmentMapper() {}

  public static GetAppointmentBlockGroupDto mapAppointmentBlockGroupToDto(
      AppointmentBlockGroupData appointmentBlockGroupData) {
    if (appointmentBlockGroupData == null) {
      return null;
    }
    return new GetAppointmentBlockGroupDto(
        appointmentBlockGroupData.externalId(),
        appointmentBlockGroupData.types(),
        appointmentBlockGroupData.parallelExaminations(),
        appointmentBlockGroupData.location(),
        appointmentBlockGroupData.appointmentBlocks().stream()
            .map(AppointmentMapper::mapAppointmentBlockToDto)
            .toList());
  }

  public static GetAppointmentBlockDto mapAppointmentBlockToDto(AppointmentBlockData details) {
    if (details == null) {
      return null;
    }
    return new GetAppointmentBlockDto(
        details.appointmentBlock().getExternalId(),
        details.start(),
        details.end(),
        details.freeDuration() == null ? null : details.freeDuration().toString(),
        details.bookedDuration().toString());
  }

  public static AppointmentDto mapAppointmentToDto(Appointment appointment) {
    if (appointment == null) {
      return null;
    }

    Instant start = appointment.getAppointmentStart();
    Instant end = appointment.getAppointmentEnd();
    return new AppointmentDto(start, end);
  }

  public static AppointmentBlockGroupPageSpec mapToPageSpec(
      int page, int pageSize, AppointmentBlockSortKey sortField, SortDirection direction) {
    return new AppointmentBlockGroupPageSpec(page, pageSize, sortField, mapDirection(direction));
  }

  public static Sort.Direction mapDirection(SortDirection sortDirection) {
    return switch (sortDirection) {
      case ASC -> Sort.Direction.ASC;
      case DESC -> Sort.Direction.DESC;
    };
  }
}
