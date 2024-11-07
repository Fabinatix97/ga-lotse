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
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedureRepository;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;

@Service
public class StiProtectionEventMetadataService implements EventMetadataService {

  private final AppointmentBlockRepository appointmentBlockRepository;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final StiProtectionProcedureRepository procedureRepository;

  public StiProtectionEventMetadataService(
      AppointmentBlockRepository appointmentBlockRepository,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      StiProtectionProcedureRepository procedureRepository) {
    this.appointmentBlockRepository = appointmentBlockRepository;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.procedureRepository = procedureRepository;
  }

  @Override
  public Stream<EventWithMetaData> findByCalendarEventIds(List<UUID> eventIds) {
    List<AppointmentBlock> appointmentBlocks =
        appointmentBlockRepository.findAllByCalendarEventIdInOrderById(eventIds);
    Stream<EventWithMetaData> appointmentBlockMetaData =
        appointmentBlockSlotUtil
            .augmentAppointmentBlocksWithEventDetails(appointmentBlocks)
            .values()
            .stream()
            .map(StiProtectionEventMetadataService::mapAppointmentBlockToEventWithMetaData);

    Stream<EventWithMetaData> stiProcedures =
        procedureRepository.findAllByCalendarEventIdOrderById(eventIds).stream()
            .map(this::mapStiProcedureAppointmentToEventMetaData);

    return Stream.concat(appointmentBlockMetaData, stiProcedures);
  }

  private EventWithMetaData mapStiProcedureAppointmentToEventMetaData(
      StiProtectionProcedure procedure) {
    Appointment appointment =
        Objects.requireNonNull(procedure.getAppointment(), "Appointment should not be null.");
    AppointmentType type =
        Objects.requireNonNull(
            getAppointmentType(appointment.getAppointmentBlock()),
            "AppointmentBlock should not be null.");

    return new EventWithMetaData(
        procedure.getCalendarEventId(),
        mapAppointmentTypeToSubjectString(type),
        null,
        null,
        procedure.getExternalId());
  }

  private static EventWithMetaData mapAppointmentBlockToEventWithMetaData(
      AppointmentBlockData appointmentBlockData) {

    AppointmentType type = getAppointmentType(appointmentBlockData);
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

  private static AppointmentType getAppointmentType(AppointmentBlockData appointmentBlockData) {
    return getAppointmentType(
        Objects.requireNonNull(
            appointmentBlockData.appointmentBlock(), "AppointmentBlock should not be null."));
  }

  private static AppointmentType getAppointmentType(AppointmentBlock appointmentBlock) {
    AppointmentBlockGroup appointmentBlockGroup =
        Objects.requireNonNull(
            appointmentBlock.getAppointmentBlockGroup(),
            "AppointmentBlockGroup should not be null.");
    return Objects.requireNonNull(
        appointmentBlockGroup.getType(), "AppointmentType should not be null.");
  }

  private static void validateAppointmentType(AppointmentType type) {
    Objects.requireNonNull(type, "The AppointmentType should not be null.");

    if (type != AppointmentType.HIV_STI_CONSULTATION
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
