/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.eventmetadata;

import de.eshg.calendar.lib.EventMetadataService;
import de.eshg.calendar.lib.api.EventWithMetaData;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.model.AppointmentBlockData;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;

@Service
public class OfficialMedicalServiceEventMetadataService implements EventMetadataService {

  private final AppointmentBlockRepository appointmentBlockRepository;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;

  public OfficialMedicalServiceEventMetadataService(
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
        .map(this::mapAppointmentBlockToEventMetaData);
  }

  private EventWithMetaData mapAppointmentBlockToEventMetaData(
      AppointmentBlockData appointmentBlockData) {
    Set<AppointmentType> types =
        appointmentBlockData.appointmentBlock().getAppointmentBlockGroup().getTypes();

    String subject = "Amtsärztliches Gutachten";
    String description =
        AppointmentBlockSlotUtil.getAppointmentBlockDescription(
            AppointmentBlockSlotUtil.mapAppointmentTypesToNames(types), appointmentBlockData);

    return new EventWithMetaData(
        appointmentBlockData.appointmentBlock().getCalendarEventId(),
        subject,
        description,
        null,
        null);
  }
}
