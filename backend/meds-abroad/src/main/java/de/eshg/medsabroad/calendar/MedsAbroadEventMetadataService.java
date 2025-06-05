/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.calendar;

import de.eshg.calendar.lib.EventMetadataService;
import de.eshg.calendar.lib.api.EventWithMetaData;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.model.AppointmentBlockData;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedureRepository;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;

@Service
public class MedsAbroadEventMetadataService implements EventMetadataService {

  private final AppointmentBlockRepository appointmentBlockRepository;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final MedsAbroadProcedureRepository medsAbroadProcedureRepository;

  public MedsAbroadEventMetadataService(
      AppointmentBlockRepository appointmentBlockRepository,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      MedsAbroadProcedureRepository medsAbroadProcedureRepository) {
    this.appointmentBlockRepository = appointmentBlockRepository;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.medsAbroadProcedureRepository = medsAbroadProcedureRepository;
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
            .map(MedsAbroadEventMetadataService::mapAppointmentBlockToEventWithMetaData);

    Stream<EventWithMetaData> medsAbroadProcedures =
        medsAbroadProcedureRepository.findAllByCalendarEventIdOrderById(eventIds).stream()
            .map(MedsAbroadEventMetadataService::mapMedsAbroadProcedureAppointmentToEventMetaData);

    return Stream.concat(appointmentBlockMetaData, medsAbroadProcedures);
  }

  private static EventWithMetaData mapAppointmentBlockToEventWithMetaData(
      AppointmentBlockData appointmentBlockData) {
    Set<AppointmentType> types =
        appointmentBlockData.appointmentBlock().getAppointmentBlockGroup().getTypes();
    String subject = AppointmentBlockSlotUtil.mapAppointmentTypesToNames(types);

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

  private static EventWithMetaData mapMedsAbroadProcedureAppointmentToEventMetaData(
      MedsAbroadProcedure procedure) {
    Set<AppointmentType> types = getAppointmentType(procedure.getAppointment());

    return new EventWithMetaData(
        procedure.getCalendarEventId(),
        AppointmentBlockSlotUtil.mapAppointmentTypesToNames(types),
        null,
        null,
        procedure.getExternalId());
  }

  private static Set<AppointmentType> getAppointmentType(Appointment appointment) {
    Objects.requireNonNull(appointment, "Appointment should not be null.");
    AppointmentBlock appointmentBlock =
        Objects.requireNonNull(
            appointment.getAppointmentBlock(), "AppointmentBlock should not be null.");
    AppointmentBlockGroup appointmentBlockGroup =
        Objects.requireNonNull(
            appointmentBlock.getAppointmentBlockGroup(),
            "AppointmentBlockGroup should not be null.");
    return appointmentBlockGroup.getTypes();
  }
}
