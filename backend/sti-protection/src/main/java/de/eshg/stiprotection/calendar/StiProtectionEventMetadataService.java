/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.calendar;

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
public class StiProtectionEventMetadataService implements EventMetadataService {

  private final AppointmentBlockRepository appointmentBlockRepository;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;

  public StiProtectionEventMetadataService(
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
        .map(StiProtectionEventMetadataService::mapAppointmentBlockToEventWithMetaData);
  }

  private static EventWithMetaData mapAppointmentBlockToEventWithMetaData(
      AppointmentBlockData appointmentBlockData) {
    AppointmentType type =
        appointmentBlockData.appointmentBlock().getAppointmentBlockGroup().getType();
    validateAppointmentType(type);

    String subject = mapAppointmentTypeToSubjectString(type);
    String description =
        "Terminblock für %s. Freie Termine: %s. Gebuchte Termine: %s."
            .formatted(
                mapAppointmentTypeToString(type),
                appointmentBlockData.numberOfFreeAppointments(),
                appointmentBlockData.numberOfBookedAppointments());

    return new EventWithMetaData(
        appointmentBlockData.appointmentBlock().getCalendarEventId(),
        subject,
        description,
        null,
        null);
  }

  private static void validateAppointmentType(AppointmentType type) {
    if (type == null) {
      throw new NullPointerException("The appointment block type should not be null");
    } else if (type != AppointmentType.HIV_STI_CONSULTATION
        && type != AppointmentType.SEX_WORK
        && type != AppointmentType.RESULTS_REVIEW) {
      throw new IllegalArgumentException(createIllegalAppointmentTypeMessage(type));
    }
  }

  private static String mapAppointmentTypeToSubjectString(AppointmentType type) {
    if (type == null) {
      return null;
    }

    if (type == AppointmentType.HIV_STI_CONSULTATION) {
      return "HIV/STI - Beratung";
    } else {
      return "HIV/STI - " + mapAppointmentTypeToString(type);
    }
  }

  private static String mapAppointmentTypeToString(AppointmentType type) {
    if (type == null) {
      return null;
    }

    return switch (type) {
      case HIV_STI_CONSULTATION -> "HIV/STI Beratung";
      case SEX_WORK -> "Sexarbeit";
      case RESULTS_REVIEW -> "Ergebnisbesprechung";
      default -> throw new IllegalArgumentException(createIllegalAppointmentTypeMessage(type));
    };
  }

  private static String createIllegalAppointmentTypeMessage(AppointmentType type) {
    return "Unexpected appointment block type: %s. The allowed types are: %s."
        .formatted(
            type,
            String.join(
                ", ",
                AppointmentType.HIV_STI_CONSULTATION.toString(),
                AppointmentType.SEX_WORK.toString(),
                AppointmentType.RESULTS_REVIEW.toString()));
  }
}
