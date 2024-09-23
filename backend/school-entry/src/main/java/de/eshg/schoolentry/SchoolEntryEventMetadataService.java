/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.calendar.lib.EventMetadataService;
import de.eshg.calendar.lib.api.EventWithMetaData;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.model.AppointmentBlockData;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;

@Service
public class SchoolEntryEventMetadataService implements EventMetadataService {

  private final AppointmentBlockRepository appointmentBlockRepository;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;

  public SchoolEntryEventMetadataService(
      AppointmentBlockRepository appointmentBlockRepository,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil) {
    this.appointmentBlockRepository = appointmentBlockRepository;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
  }

  @Override
  public Stream<EventWithMetaData> findByCalendarEventIds(List<UUID> eventIds) {
    List<AppointmentBlock> appointmentBlocks =
        appointmentBlockRepository.findAllByCalendarEventIdInOrderById(eventIds);
    return appointmentBlockSlotUtil
        .augmentAppointmentBlocksWithEventDetails(appointmentBlocks)
        .values()
        .stream()
        .map(SchoolEntryEventMetadataService::mapAppointmentBlockToEventMetaData);
  }

  private static EventWithMetaData mapAppointmentBlockToEventMetaData(
      AppointmentBlockData appointmentBlockData) {
    AppointmentType type =
        appointmentBlockData.appointmentBlock().getAppointmentBlockGroup().getType();
    String mappedType =
        switch (type) {
          case REGULAR_EXAMINATION -> "Regelkinder";
          case CAN_CHILD -> "Kann-Kinder";
          case ENTRY_LEVEL -> "Eingangsstufenkinder";
          case SPECIAL_NEEDS -> "Kinder mit besonderem Förderbedarf";
          default ->
              throw new IllegalArgumentException("Unexpected appointment block type: " + type);
        };

    String subject = "Einschulungsuntersuchung";
    String description =
        "Terminblock für %s. Freie Termine: %s. Gebuchte Termine: %s."
            .formatted(
                mappedType,
                appointmentBlockData.numberOfFreeAppointments(),
                appointmentBlockData.numberOfBookedAppointments());

    return new EventWithMetaData(
        appointmentBlockData.appointmentBlock().getCalendarEventId(),
        subject,
        description,
        null,
        null);
  }
}
