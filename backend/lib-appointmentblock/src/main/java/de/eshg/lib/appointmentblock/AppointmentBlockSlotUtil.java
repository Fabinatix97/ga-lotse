/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.appointmentblock.model.AppointmentBlockData;
import de.eshg.lib.appointmentblock.model.AppointmentBlockSlot;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup;
import de.eshg.rest.service.error.BadRequestException;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class AppointmentBlockSlotUtil {

  private final AppointmentBlockRepository appointmentBlockRepository;

  AppointmentBlockSlotUtil(AppointmentBlockRepository appointmentBlockRepository) {
    this.appointmentBlockRepository = appointmentBlockRepository;
  }

  public Map<AppointmentBlock, List<AppointmentBlockSlot>> calculateFreeAppointmentBlockSlots(
      List<AppointmentBlock> appointmentBlocks) {

    Map<AppointmentBlock, List<AppointmentBlockSlot>> freeAppointmentBlockSlots =
        new LinkedHashMap<>();

    for (AppointmentBlock appointmentBlock : appointmentBlocks) {
      List<Instant> startsOfBookedAppointments =
          appointmentBlock.getAppointments().stream()
              .map(Appointment::getAppointmentStart)
              .collect(Collectors.toList());

      List<AppointmentBlockSlot> appointmentBlockSlots = splitAppointmentBlock(appointmentBlock);

      List<AppointmentBlockSlot> freeSlots =
          freeAppointmentBlockSlots.computeIfAbsent(appointmentBlock, key -> new ArrayList<>());

      for (AppointmentBlockSlot appointmentBlockSlot : appointmentBlockSlots) {
        Instant start = appointmentBlockSlot.start();
        if (!startsOfBookedAppointments.remove(start)) {
          freeSlots.add(appointmentBlockSlot);
        }
      }
    }

    return freeAppointmentBlockSlots;
  }

  private List<AppointmentBlockSlot> splitAppointmentBlock(AppointmentBlock appointmentBlock) {
    List<AppointmentBlockSlot> slots = new ArrayList<>();

    AppointmentBlockGroup appointmentBlockGroup = appointmentBlock.getAppointmentBlockGroup();

    int parallelExaminations = appointmentBlockGroup.getParallelExaminations();
    Instant start = appointmentBlock.getAppointmentBlockStart();
    Instant end = appointmentBlock.getAppointmentBlockEnd();
    long sequentialSlotCount =
        getNumberOfSequentialAppointmentSlots(appointmentBlockGroup.getSlotDuration(), start, end);

    Duration examinationDuration = appointmentBlockGroup.getSlotDuration();
    Instant slotStart = start;
    for (int i = 0; i < sequentialSlotCount; i++) {
      Instant slotEnd = slotStart.plus(examinationDuration);
      for (int j = 0; j < parallelExaminations; j++) {
        slots.add(new AppointmentBlockSlot(slotStart, slotEnd));
      }

      slotStart = slotEnd;
    }
    return slots;
  }

  private long getNumberOfSequentialAppointmentSlots(
      Duration examinationDuration, Instant start, Instant end) {
    Duration appointmentBlockDuration = Duration.between(start, end);
    return appointmentBlockDuration.dividedBy(examinationDuration);
  }

  public void updateAppointment(
      AppointmentType appointmentType,
      UUID locationId,
      UUID physicianId,
      EntityWithAppointment entityWithAppointment,
      Instant appointmentStart,
      Instant appointmentEnd) {
    Appointment newAppointment = new Appointment();
    newAppointment.setAppointmentStart(appointmentStart);
    newAppointment.setAppointmentEnd(appointmentEnd);
    newAppointment.setType(appointmentType);

    Appointment currentAppointment = entityWithAppointment.getAppointment();
    if (currentAppointment != null) {
      if (currentAppointment.getAppointmentStart().equals(appointmentStart)
          && currentAppointment.getAppointmentEnd().equals(appointmentEnd)
          && currentAppointment.getType().equals(appointmentType)) {
        return;
      }

      AppointmentBlock currentAppointmentBlock = currentAppointment.getAppointmentBlock();
      boolean removed = currentAppointmentBlock.getAppointments().remove(currentAppointment);
      Assert.isTrue(removed, "Failed to remove current appointment");
    }

    AppointmentBlock newAppointmentBlock =
        findSuitableAppointmentBlock(
            appointmentType, locationId, physicianId, appointmentStart, appointmentEnd);

    boolean added = newAppointmentBlock.getAppointments().add(newAppointment);
    Assert.isTrue(added, "Failed to add new appointment");

    newAppointment.setAppointmentBlock(newAppointmentBlock);

    entityWithAppointment.setAppointment(newAppointment);
  }

  public void removeAppointment(EntityWithAppointment entityWithAppointment) {
    Appointment appointment = entityWithAppointment.getAppointment();
    AppointmentBlock appointmentBlock = appointment.getAppointmentBlock();
    boolean removed = appointmentBlock.getAppointments().remove(appointment);
    Assert.isTrue(removed, "Failed to remove appointment");
    entityWithAppointment.setAppointment(null);
  }

  private AppointmentBlock findSuitableAppointmentBlock(
      AppointmentType appointmentType,
      UUID locationId,
      UUID physicianId,
      Instant start,
      Instant end) {
    AppointmentBlockSlot requestedSlot = new AppointmentBlockSlot(start, end);

    List<AppointmentBlock> appointmentBlocks =
        appointmentBlockRepository
            .findBlockByAppointmentTypeAndLocationAndAppointmentInBlockWithLock(
                appointmentType, locationId, start, end);

    Map<AppointmentBlock, List<AppointmentBlockSlot>> freeAppointmentBlockSlots =
        calculateFreeAppointmentBlockSlots(appointmentBlocks);

    Stream<AppointmentBlock> appointmentBlock =
        freeAppointmentBlockSlots.entrySet().stream()
            .filter(entry -> entry.getValue().contains(requestedSlot))
            .map(Entry::getKey);

    if (physicianId != null) {
      appointmentBlock =
          appointmentBlock.sorted(
              Comparator.comparing(
                  block -> {
                    List<UUID> physicians = block.getAppointmentBlockGroup().getPhysicians();
                    return physicians.contains(physicianId) ? physicians.size() : Integer.MAX_VALUE;
                  }));
    }

    return appointmentBlock
        .findFirst()
        .orElseThrow(
            () ->
                new BadRequestException(
                    "The requested time slot does not fit into any appointment-block"));
  }

  public Map<AppointmentBlock, AppointmentBlockData> augmentAppointmentBlocksWithEventDetails(
      List<AppointmentBlock> appointmentBlocks) {
    if (appointmentBlocks.isEmpty()) {
      return Map.of();
    }

    return appointmentBlocks.stream()
        .map(this::augmentAppointmentBlockWithEventDetails)
        .collect(StreamUtil.toLinkedHashMap(AppointmentBlockData::appointmentBlock));
  }

  private AppointmentBlockData augmentAppointmentBlockWithEventDetails(
      AppointmentBlock appointmentBlock) {

    Duration totalDuration =
        Duration.between(
                appointmentBlock.getAppointmentBlockStart(),
                appointmentBlock.getAppointmentBlockEnd())
            .multipliedBy(appointmentBlock.getAppointmentBlockGroup().getParallelExaminations());
    Duration bookedDuration =
        appointmentBlock.getAppointments().stream()
            .map(
                appointment ->
                    Duration.between(
                        appointment.getAppointmentStart(), appointment.getAppointmentEnd()))
            .reduce(Duration::plus)
            .orElse(Duration.ZERO);

    return new AppointmentBlockData(
        appointmentBlock,
        appointmentBlock.getAppointmentBlockStart(),
        appointmentBlock.getAppointmentBlockEnd(),
        totalDuration.compareTo(bookedDuration) < 0 ? null : totalDuration.minus(bookedDuration),
        bookedDuration);
  }

  public static String mapAppointmentTypesToNames(Set<AppointmentType> appointmentTypes) {
    return String.join(
        " & ",
        appointmentTypes.stream().map(AppointmentBlockSlotUtil::mapAppointmentTypeToName).toList());
  }

  public static String mapAppointmentTypeToName(AppointmentType type) {
    return switch (type) {
      case CONSULTATION -> "Beratung";
      case VACCINATION -> "Impfung";
      case REGULAR_EXAMINATION -> "Regelkinder";
      case CAN_CHILD -> "Kann-Kinder";
      case ENTRY_LEVEL -> "Eingangsstufenkinder";
      case SPECIAL_NEEDS -> "Kinder mit besonderem Förderbedarf";
      case PROOF_SUBMISSION -> "Nachweisvorlage";
      case HIV_STI_CONSULTATION -> "Beratung";
      case SEX_WORK -> "Sexarbeit";
      case RESULTS_REVIEW -> "Ergebnisbesprechung";
      case OFFICIAL_MEDICAL_SERVICE_SHORT -> "Amtsärztliches Gutachten";
      case OFFICIAL_MEDICAL_SERVICE_LONG -> "Amtsärztliches Gutachten";
      case MEDS_ABROAD_CERTIFICATION -> "Reisen mit BTM - Beglaubigung";
    };
  }

  public static String getAppointmentBlockDescription(
      String purpose, AppointmentBlockData appointmentBlockData) {
    StringBuilder builder = new StringBuilder();
    builder.append("Terminblock für ").append(purpose).append(". ");
    if (appointmentBlockData.freeDuration() != null) {
      builder
          .append("Freie Zeit: ")
          .append(mapDurationToString(appointmentBlockData.freeDuration()))
          .append(". ");
    }
    builder
        .append("Gebuchte Zeit: ")
        .append(mapDurationToString(appointmentBlockData.bookedDuration()))
        .append(".");
    return builder.toString();
  }

  private static String mapDurationToString(Duration duration) {
    long minutes = duration.getSeconds() / 60;
    long hours = minutes / 60;
    StringBuilder builder = new StringBuilder();
    if (hours > 0) {
      builder.append("%sh ".formatted(hours));
      minutes = minutes - hours * 60;
    }
    builder.append("%sm".formatted(minutes));
    return builder.toString();
  }
}
