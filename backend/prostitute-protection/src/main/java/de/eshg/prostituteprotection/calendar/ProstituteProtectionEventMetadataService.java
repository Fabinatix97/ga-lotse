/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.calendar;

import de.eshg.calendar.lib.EventMetadataService;
import de.eshg.calendar.lib.api.EventWithMetaData;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.model.AppointmentBlockData;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.prostituteprotection.domain.model.ProstituteProtectionProcedure;
import de.eshg.prostituteprotection.domain.repository.ProstituteProtectionProcedureRepository;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;

@Service
public class ProstituteProtectionEventMetadataService implements EventMetadataService {

  public static final String SUBJECT = "Prostituiertenschutzgesetz";
  private final AppointmentBlockRepository appointmentBlockRepository;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final ProstituteProtectionProcedureRepository prostituteProtectionProcedureRepository;

  public ProstituteProtectionEventMetadataService(
      AppointmentBlockRepository appointmentBlockRepository,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      ProstituteProtectionProcedureRepository prostituteProtectionProcedureRepository) {
    this.appointmentBlockRepository = appointmentBlockRepository;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.prostituteProtectionProcedureRepository = prostituteProtectionProcedureRepository;
  }

  @Override
  public Stream<EventWithMetaData> findByCalendarEventIds(List<UUID> eventIds) {
    List<AppointmentBlock> appointmentBlocks =
        appointmentBlockRepository.findAllByCalendarEventIdInOrderById(eventIds);
    Stream<EventWithMetaData> appointmentBlockEvents =
        appointmentBlockSlotUtil
            .augmentAppointmentBlocksWithEventDetails(appointmentBlocks)
            .values()
            .stream()
            .map(ProstituteProtectionEventMetadataService::mapAppointmentBlockToEventMetaData);

    Stream<EventWithMetaData> procedureEvents =
        prostituteProtectionProcedureRepository
            .findAllByCalendarEventIdInOrderByCalendarEventId(eventIds)
            .stream()
            .map(this::mapUserDefinedAppointmentToEventMetaData);

    return Stream.concat(appointmentBlockEvents, procedureEvents);
  }

  private EventWithMetaData mapUserDefinedAppointmentToEventMetaData(
      ProstituteProtectionProcedure procedure) {
    return new EventWithMetaData(
        procedure.getCalendarEventId(), SUBJECT, null, null, procedure.getExternalId());
  }

  private static EventWithMetaData mapAppointmentBlockToEventMetaData(
      AppointmentBlockData appointmentBlockData) {
    Set<AppointmentType> types =
        appointmentBlockData.appointmentBlock().getAppointmentBlockGroup().getTypes();

    String description =
        AppointmentBlockSlotUtil.getAppointmentBlockDescription(
            AppointmentBlockSlotUtil.mapAppointmentTypesToNames(types), appointmentBlockData);

    return new EventWithMetaData(
        appointmentBlockData.appointmentBlock().getCalendarEventId(),
        SUBJECT,
        description,
        null,
        null);
  }
}
