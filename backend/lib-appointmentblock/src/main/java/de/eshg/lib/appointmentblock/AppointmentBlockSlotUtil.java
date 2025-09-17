/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.appointmentblock.model.AppointmentBlockData;
import de.eshg.lib.appointmentblock.model.AppointmentBlockSlot;
import de.eshg.lib.appointmentblock.model.AppointmentBlockSlotWithAppointment;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentTypeHolder;
import de.eshg.rest.service.error.BadRequestException;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.jetbrains.annotations.VisibleForTesting;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class AppointmentBlockSlotUtil {

  private static final Logger log = LoggerFactory.getLogger(AppointmentBlockSlotUtil.class);

  private final AppointmentBlockRepository appointmentBlockRepository;

  AppointmentBlockSlotUtil(AppointmentBlockRepository appointmentBlockRepository) {
    this.appointmentBlockRepository = appointmentBlockRepository;
  }

  public Map<AppointmentBlock, List<AppointmentBlockSlot>>
      calculateFreeAppointmentBlockSlotsForType(
          List<AppointmentBlock> appointmentBlocks, AppointmentType appointmentType) {

    Map<AppointmentBlock, List<AppointmentBlockSlot>> freeAppointmentBlockSlots =
        new LinkedHashMap<>();

    for (AppointmentBlock appointmentBlock : appointmentBlocks) {
      Optional<AppointmentTypeHolder> typeHolderOptional =
          appointmentBlock.getAppointmentBlockGroup().getAppointmentTypeHolders().stream()
              .filter(holder -> holder.getType().equals(appointmentType))
              .findFirst();
      if (typeHolderOptional.isEmpty()) {
        continue;
      }
      Set<Duration> possibleDurations = getPossibleDurations(appointmentBlock);

      List<AppointmentBlockSlot> freeSlots =
          calculateFreeAppointmentSlotsInBlock(
              appointmentBlock, typeHolderOptional.get().getSlotDuration(), possibleDurations);
      if (!freeSlots.isEmpty()) {
        freeAppointmentBlockSlots.put(appointmentBlock, freeSlots);
      }
    }

    return freeAppointmentBlockSlots;
  }

  static Set<Duration> getPossibleDurations(AppointmentBlock appointmentBlock) {
    return appointmentBlock.getAppointmentBlockGroup().getAppointmentTypeHolders().stream()
        .map(AppointmentTypeHolder::getSlotDuration)
        .collect(Collectors.toSet());
  }

  @VisibleForTesting
  static List<AppointmentBlockSlot> calculateFreeAppointmentSlotsInBlock(
      AppointmentBlock appointmentBlock, Duration slotDuration, Set<Duration> possibleDurations) {
    List<List<AppointmentBlockSlotWithAppointment>> binsWithBookedSlots =
        calculateBinsWithBookedSlots(appointmentBlock, possibleDurations);
    return FreeSlotsUtil.calculateBestAvailableFreeSlots(
        binsWithBookedSlots, slotDuration, possibleDurations, appointmentBlock);
  }

  static List<List<AppointmentBlockSlotWithAppointment>> calculateBinsWithBookedSlots(
      AppointmentBlock appointmentBlock, Set<Duration> possibleDurations) {
    List<AppointmentBlockSlotWithAppointment> bookedSlots =
        appointmentBlock.getAppointments().stream()
            .map(
                appointment ->
                    new AppointmentBlockSlotWithAppointment(
                        appointment.getAppointmentStart(),
                        appointment.getAppointmentEnd(),
                        appointment))
            .sorted(
                Comparator.comparing(AppointmentBlockSlotWithAppointment::start)
                    .thenComparing(
                        Comparator.comparing(AppointmentBlockSlotWithAppointment::end).reversed()))
            .toList();

    List<List<AppointmentBlockSlotWithAppointment>> binsWithBookedSlots = new ArrayList<>();
    int parallelExaminations = appointmentBlock.getParallelExaminations();
    for (int i = 0; i < parallelExaminations; i++) {
      binsWithBookedSlots.add(new ArrayList<>());
    }
    for (AppointmentBlockSlotWithAppointment bookedSlot : bookedSlots) {
      List<AppointmentBlockSlotWithAppointment> bin =
          BinsWithBookedSlotsUtil.getBin(
              binsWithBookedSlots, bookedSlot, possibleDurations, appointmentBlock.getId());
      log.debug(
          "Putting {} in bin {} of block {}",
          bookedSlot,
          binsWithBookedSlots.indexOf(bin),
          appointmentBlock.getId());
      bin.add(bookedSlot);
    }
    return binsWithBookedSlots;
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

    Duration appointmentDuration = Duration.between(start, end);
    List<AppointmentBlock> appointmentBlocks =
        appointmentBlockRepository
            .findBlockByAppointmentTypeAndLocationAndAppointmentInBlockWithLock(
                appointmentType, locationId, start, end)
            .stream()
            .filter(
                block ->
                    block.getAppointmentBlockGroup().getAppointmentTypeHolders().stream()
                        .filter(holder -> holder.getType().equals(appointmentType))
                        .map(AppointmentTypeHolder::getSlotDuration)
                        .collect(Collectors.toSet())
                        .contains(appointmentDuration))
            .toList();

    Map<AppointmentBlock, List<AppointmentBlockSlot>> freeAppointmentBlockSlots =
        calculateFreeAppointmentBlockSlotsForType(appointmentBlocks, appointmentType);

    Stream<AppointmentBlock> appointmentBlockStream =
        freeAppointmentBlockSlots.entrySet().stream()
            .filter(entry -> entry.getValue().contains(requestedSlot))
            .map(Entry::getKey);

    if (physicianId != null) {
      appointmentBlockStream =
          appointmentBlockStream.sorted(
              Comparator.comparing(
                  block -> {
                    List<UUID> physicians = block.getAppointmentBlockGroup().getPhysicians();
                    return physicians.contains(physicianId) ? physicians.size() : Integer.MAX_VALUE;
                  }));
    }

    return appointmentBlockStream
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
            .multipliedBy(appointmentBlock.getParallelExaminations());
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
        appointmentBlock.getParallelExaminations(),
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

  private static class BinsWithBookedSlotsUtil {

    private static List<AppointmentBlockSlotWithAppointment> getBin(
        List<List<AppointmentBlockSlotWithAppointment>> binsWithBookedSlots,
        AppointmentBlockSlotWithAppointment bookedSlot,
        Set<Duration> possibleDurations,
        Long appointmentBlockId) {
      Optional<List<AppointmentBlockSlotWithAppointment>> greatFitOptional =
          binsWithBookedSlots.stream()
              .filter(
                  slotBin ->
                      slotBin.isEmpty() || slotBin.getLast().end().equals(bookedSlot.start()))
              .findFirst();
      if (greatFitOptional.isPresent()) {
        return greatFitOptional.get();
      }
      Optional<List<AppointmentBlockSlotWithAppointment>> goodFitOptional =
          binsWithBookedSlots.stream()
              .filter(slotBin -> goodFit(slotBin, bookedSlot, possibleDurations))
              .findFirst();
      return goodFitOptional.orElseGet(
          () -> getBadFitBin(binsWithBookedSlots, bookedSlot, appointmentBlockId));
    }

    private static boolean goodFit(
        List<AppointmentBlockSlotWithAppointment> slotBin,
        AppointmentBlockSlotWithAppointment bookedSlot,
        Set<Duration> possibleDurations) {
      Instant lastEnd = slotBin.getLast().end();
      if (!lastEnd.isBefore(bookedSlot.start())) {
        return false;
      }
      Set<Instant> nextStarts = Set.of(lastEnd);
      while (true) {
        nextStarts = calculateNextStarts(possibleDurations, nextStarts, bookedSlot.start());
        if (nextStarts.contains(bookedSlot.start())) {
          return true;
        }
        if (nextStarts.isEmpty()) {
          return false;
        }
      }
    }

    private static Set<Instant> calculateNextStarts(
        Set<Duration> possibleDurations, Set<Instant> oldStarts, Instant wantedStart) {
      return possibleDurations.stream()
          .map(
              duration ->
                  oldStarts.stream()
                      .map(start -> start.plus(duration))
                      .filter(start -> !start.isAfter(wantedStart))
                      .toList())
          .flatMap(Collection::stream)
          .collect(Collectors.toSet());
    }

    private static List<AppointmentBlockSlotWithAppointment> getBadFitBin(
        List<List<AppointmentBlockSlotWithAppointment>> binsWithBookedSlots,
        AppointmentBlockSlotWithAppointment bookedSlot,
        Long appointmentBlockId) {
      return binsWithBookedSlots.stream()
          .filter(slotBin -> badFit(slotBin, bookedSlot))
          .findFirst()
          .orElseThrow(
              () ->
                  new IllegalStateException(
                      "Could not find a place for booked slot '%s' - '%s' in block with id '%s'"
                          .formatted(bookedSlot.start(), bookedSlot.end(), appointmentBlockId)));
    }

    private static boolean badFit(
        List<AppointmentBlockSlotWithAppointment> slotBin,
        AppointmentBlockSlotWithAppointment bookedSlot) {
      Instant lastEnd = slotBin.getLast().end();
      return lastEnd.isBefore(bookedSlot.start());
    }
  }

  static class FreeSlotsUtil {
    private FreeSlotsUtil() {}

    private static List<AppointmentBlockSlot> calculateBestAvailableFreeSlots(
        List<List<AppointmentBlockSlotWithAppointment>> binsWithBookedSlots,
        Duration slotDuration,
        Set<Duration> possibleDurations,
        AppointmentBlock appointmentBlock) {
      List<AppointmentBlockSlot> greatFreeSlots = new ArrayList<>();
      List<AppointmentBlockSlot> otherFreeSlots = new ArrayList<>();
      binsWithBookedSlots.forEach(
          bin ->
              calculateFreeSlotsInBin(
                  bin,
                  slotDuration,
                  possibleDurations,
                  appointmentBlock,
                  greatFreeSlots,
                  otherFreeSlots));
      List<AppointmentBlockSlot> result;
      if (greatFreeSlots.isEmpty()) {
        result = otherFreeSlots;
      } else {
        result = greatFreeSlots;
      }
      return result.stream()
          .distinct()
          .sorted(Comparator.comparing(AppointmentBlockSlot::start))
          .toList();
    }

    private static void calculateFreeSlotsInBin(
        List<AppointmentBlockSlotWithAppointment> binWithBookedSlots,
        Duration slotDuration,
        Set<Duration> possibleDurations,
        AppointmentBlock appointmentBlock,
        List<AppointmentBlockSlot> greatFreeSlots,
        List<AppointmentBlockSlot> otherFreeSlots) {
      List<AppointmentBlockSlot> freeTimes =
          findFreeTimesInBin(binWithBookedSlots, appointmentBlock);

      freeTimes.forEach(
          timeSlot -> {
            List<AppointmentBlockSlot> freeSlots =
                calculateFreeSlotsInTimeRange(
                        Stream.of(timeSlot.start()),
                        timeSlot.end(),
                        slotDuration,
                        possibleDurations,
                        new HashSet<>())
                    .toList();

            if (!freeSlots.isEmpty()) {
              Instant startAfterFirstPossibleSlot = timeSlot.start().plus(slotDuration);
              boolean greatFit =
                  greatFitForPossibleDurations(
                      Duration.between(startAfterFirstPossibleSlot, timeSlot.end()),
                      possibleDurations);
              if (greatFit) {
                greatFreeSlots.addAll(freeSlots);
              } else {
                otherFreeSlots.addAll(freeSlots);
              }
            }
          });
    }

    static List<AppointmentBlockSlot> findFreeTimesInBin(
        List<AppointmentBlockSlotWithAppointment> binWithBookedSlots,
        AppointmentBlock appointmentBlock) {
      if (binWithBookedSlots.isEmpty()) {
        return List.of(
            new AppointmentBlockSlot(
                appointmentBlock.getAppointmentBlockStart(),
                appointmentBlock.getAppointmentBlockEnd()));
      }

      List<AppointmentBlockSlot> freeTimes = new ArrayList<>();
      AppointmentBlockSlotWithAppointment firstBookedSlot = binWithBookedSlots.getFirst();
      if (firstBookedSlot.start().isAfter(appointmentBlock.getAppointmentBlockStart())) {
        freeTimes.add(
            new AppointmentBlockSlot(
                appointmentBlock.getAppointmentBlockStart(), firstBookedSlot.start()));
      }
      if (binWithBookedSlots.size() > 1) {
        for (int i = 0; i < binWithBookedSlots.size() - 1; i++) {
          AppointmentBlockSlotWithAppointment slotA = binWithBookedSlots.get(i);
          AppointmentBlockSlotWithAppointment slotB = binWithBookedSlots.get(i + 1);
          if (slotA.end().isBefore(slotB.start())) {
            freeTimes.add(new AppointmentBlockSlot(slotA.end(), slotB.start()));
          }
        }
      }
      AppointmentBlockSlotWithAppointment lastBookedSlot = binWithBookedSlots.getLast();
      if (lastBookedSlot.end().isBefore(appointmentBlock.getAppointmentBlockEnd())) {
        freeTimes.add(
            new AppointmentBlockSlot(
                lastBookedSlot.end(), appointmentBlock.getAppointmentBlockEnd()));
      }
      return freeTimes;
    }

    private static Stream<AppointmentBlockSlot> calculateFreeSlotsInTimeRange(
        Stream<Instant> starts,
        Instant end,
        Duration slotDuration,
        Set<Duration> possibleDurations,
        Set<Instant> checkedStarts) {
      List<Instant> allowedStarts =
          starts
              .filter(start -> Duration.between(start, end).compareTo(slotDuration) >= 0)
              .filter(start -> !checkedStarts.contains(start))
              .toList();
      if (allowedStarts.isEmpty()) {
        return Stream.empty();
      } else {
        checkedStarts.addAll(allowedStarts);
        Stream<AppointmentBlockSlot> nextSlotsStream =
            allowedStarts.stream()
                .map(
                    start ->
                        calculateFreeSlotsInTimeRange(
                                possibleDurations.stream().map(start::plus),
                                end,
                                slotDuration,
                                possibleDurations,
                                checkedStarts)
                            .toList())
                .flatMap(Collection::stream);
        return Stream.concat(
            allowedStarts.stream()
                .map(start -> new AppointmentBlockSlot(start, start.plus(slotDuration))),
            nextSlotsStream);
      }
    }

    private static boolean greatFitForPossibleDurations(
        Duration remainingDuration, Set<Duration> possibleDurations) {
      if (remainingDuration.isZero()) {
        return true;
      }
      return possibleDurations.stream()
          .filter(possibleDuration -> possibleDuration.compareTo(remainingDuration) <= 0)
          .anyMatch(
              possibleDuration ->
                  greatFitForPossibleDurations(
                      remainingDuration.minus(possibleDuration), possibleDurations));
    }
  }
}
