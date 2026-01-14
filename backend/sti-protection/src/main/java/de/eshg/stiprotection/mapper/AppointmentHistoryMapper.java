/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.lib.appointmentblock.AppointmentTypeMapper;
import de.eshg.stiprotection.api.AppointmentHistoryEntryDto;
import de.eshg.stiprotection.persistence.db.AppointmentHistoryEntry;
import java.util.List;

public class AppointmentHistoryMapper {

  private AppointmentHistoryMapper() {}

  public static List<AppointmentHistoryEntryDto> toInterfaceType(
      List<AppointmentHistoryEntry> entities) {
    return entities.stream().map(AppointmentHistoryMapper::toInterfaceType).toList();
  }

  public static AppointmentHistoryEntryDto toInterfaceType(AppointmentHistoryEntry entity) {
    return new AppointmentHistoryEntryDto(
        AppointmentTypeMapper.toInterfaceType(entity.getAppointmentType()),
        entity.getAppointmentStart(),
        AppointmentStatusMapper.toInterfaceType(entity.getAppointmentStatus()));
  }
}
