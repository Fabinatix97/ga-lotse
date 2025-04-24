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

  public void updateAppointment(
      AppointmentType appointmentType,
      UUID locationId,
      UUID physicianId,
      EntityWithAppointment entityWithAppointment,
      Instant appointmentStart,
      Instant appointmentEnd) {
    AppointmentBlock newAppointmentBlock =
        findSuitableAppointmentBlock(
            appointmentType, locationId, physicianId, appointmentStart, appointmentEnd);

    Appointment newAppointment = new Appointment();
    newAppointment.setAppointmentStart(appointmentStart);
    newAppointment.setAppointmentEnd(appointmentEnd);

    Appointment currentAppointment = entityWithAppointment.getAppointment();
    if (currentAppointment != null) {
      if (currentAppointment == newAppointment) {
        throw new IllegalArgumentException(
            "New appointment is the same as the current appointment: " + currentAppointment);
      }

      AppointmentBlock currentAppointmentBlock = currentAppointment.getAppointmentBlock();
      boolean removed = currentAppointmentBlock.getAppointments().remove(currentAppointment);
      Assert.isTrue(removed, "Failed to remove current appointment");
    }

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

    long numberOfTotalAppointments = getNumberOfTotalAppointmentSlots(appointmentBlock);
    long numberOfBookedAppointments = appointmentBlock.getAppointments().size();
    long numberOfFreeAppointments = numberOfTotalAppointments - numberOfBookedAppointments;

    return new AppointmentBlockData(
        appointmentBlock,
        appointmentBlock.getAppointmentBlockStart(),
        appointmentBlock.getAppointmentBlockEnd(),
        numberOfFreeAppointments,
        numberOfBookedAppointments);
  }

  private long getNumberOfTotalAppointmentSlots(AppointmentBlock appointmentBlock) {
    return getNumberOfTotalAppointmentSlots(
        appointmentBlock.getAppointmentBlockGroup().getSlotDuration(),
        appointmentBlock.getAppointmentBlockGroup().getParallelExaminations(),
        appointmentBlock.getAppointmentBlockStart(),
        appointmentBlock.getAppointmentBlockEnd());
  }

  private long getNumberOfTotalAppointmentSlots(
      Duration slotDuration, int parallelExaminations, Instant start, Instant end) {
    long numberOfSequentialSlots = getNumberOfSequentialAppointmentSlots(slotDuration, start, end);
    return numberOfSequentialSlots * parallelExaminations;
  }

  private long getNumberOfSequentialAppointmentSlots(
      Duration examinationDuration, Instant start, Instant end) {
    Duration appointmentBlockDuration = Duration.between(start, end);
    return appointmentBlockDuration.dividedBy(examinationDuration);
  }
}
