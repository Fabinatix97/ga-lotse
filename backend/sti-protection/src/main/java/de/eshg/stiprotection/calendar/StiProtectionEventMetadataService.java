/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.calendar;

import static de.eshg.lib.appointmentblock.persistence.AppointmentType.HIV_STI_CONSULTATION;

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
import java.util.Set;
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
    return new EventWithMetaData(
        procedure.getCalendarEventId(),
        mapAppointmentTypeToSubjectString(appointment.getType()),
        null,
        null,
        procedure.getExternalId());
  }

  private static EventWithMetaData mapAppointmentBlockToEventWithMetaData(
      AppointmentBlockData appointmentBlockData) {

    Set<AppointmentType> types = getAppointmentTypes(appointmentBlockData);
    String prefix = "HIV/STI - ";
    String subject = prefix + AppointmentBlockSlotUtil.mapAppointmentTypesToNames(types);
    String description =
        AppointmentBlockSlotUtil.getAppointmentBlockDescription(
            String.join(
                " & ",
                types.stream()
                    .map(StiProtectionEventMetadataService::mapAppointmentTypeToString)
                    .toList()),
            appointmentBlockData);

    return new EventWithMetaData(
        appointmentBlockData.appointmentBlock().getCalendarEventId(),
        subject,
        description,
        null,
        null);
  }

  private static Set<AppointmentType> getAppointmentTypes(
      AppointmentBlockData appointmentBlockData) {
    return getAppointmentTypes(
        Objects.requireNonNull(
            appointmentBlockData.appointmentBlock(), "AppointmentBlock should not be null."));
  }

  private static Set<AppointmentType> getAppointmentTypes(AppointmentBlock appointmentBlock) {
    AppointmentBlockGroup appointmentBlockGroup =
        Objects.requireNonNull(
            appointmentBlock.getAppointmentBlockGroup(),
            "AppointmentBlockGroup should not be null.");
    return appointmentBlockGroup.getTypes();
  }

  private static String mapAppointmentTypeToSubjectString(AppointmentType type) {
    return "HIV/STI - " + AppointmentBlockSlotUtil.mapAppointmentTypeToName(type);
  }

  private static String mapAppointmentTypeToString(AppointmentType type) {
    String name = AppointmentBlockSlotUtil.mapAppointmentTypeToName(type);
    if (HIV_STI_CONSULTATION.equals(type)) {
      return "HIV/STI " + name;
    } else {
      return name;
    }
  }
}
