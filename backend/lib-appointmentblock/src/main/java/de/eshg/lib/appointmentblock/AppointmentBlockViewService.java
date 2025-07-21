/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.base.user.UserApi;
import de.eshg.base.user.api.GetUsersRequest;
import de.eshg.base.user.api.GetUsersResponse;
import de.eshg.base.user.api.UserDto;
import de.eshg.lib.appointmentblock.api.AppointmentBlockBinDto;
import de.eshg.lib.appointmentblock.api.AppointmentBlockDto;
import de.eshg.lib.appointmentblock.api.AppointmentBlockSlotDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.model.AppointmentBlockSlot;
import de.eshg.lib.appointmentblock.model.AppointmentBlockSlotWithAppointment;
import de.eshg.lib.appointmentblock.persistence.AppointmentBlockRepository;
import de.eshg.lib.appointmentblock.persistence.AppointmentRepository;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class AppointmentBlockViewService {
  private final AppointmentBlockRepository appointmentBlockRepository;
  private final UserApi userApi;
  private final AbstractAppointmentService<?> appointmentService;
  private final AppointmentRepository appointmentRepository;

  public AppointmentBlockViewService(
      AppointmentBlockRepository appointmentBlockRepository,
      UserApi userApi,
      AbstractAppointmentService<?> appointmentService,
      AppointmentRepository appointmentRepository) {
    this.appointmentBlockRepository = appointmentBlockRepository;
    this.userApi = userApi;
    this.appointmentService = appointmentService;
    this.appointmentRepository = appointmentRepository;
  }

  public List<AppointmentBlockDto> findAppointmentBlocksInTimeRange(
      Instant timeRangeStart, Instant timeRangeEnd) {
    appointmentService.checkAppointmentBlockViewFeatureActive();

    if (timeRangeStart == null || timeRangeEnd == null || !timeRangeStart.isBefore(timeRangeEnd)) {
      throw new BadRequestException("Invalid time range specified.");
    }
    if (ChronoUnit.DAYS.between(timeRangeStart, timeRangeEnd) > 8) {
      throw new BadRequestException("Allowed maximum days between start and end time is 8 days.");
    }

    List<AppointmentBlock> blocks =
        appointmentBlockRepository.findBlocksOverlappingWithTimeRange(timeRangeStart, timeRangeEnd);

    Map<UUID, UserDto> resolvedUsers = getResolvedUsers(blocks);

    return resolveAppointmentBlocks(blocks, resolvedUsers);
  }

  public AppointmentBlockDto getAppointmentBlock(UUID appointmentBlockId) {
    Optional<AppointmentBlock> blockOptional =
        appointmentBlockRepository.findByExternalId(appointmentBlockId);
    if (blockOptional.isEmpty()) {
      throw new NotFoundException(
          "Appointment block with id " + appointmentBlockId + " not found.");
    }
    List<AppointmentBlock> singleBlockList = List.of(blockOptional.get());
    Map<UUID, UserDto> resolvedUsers = getResolvedUsers(singleBlockList);
    return resolveAppointmentBlocks(singleBlockList, resolvedUsers).getFirst();
  }

  private Map<UUID, UserDto> getResolvedUsers(List<AppointmentBlock> blocks) {
    Set<UUID> allUserIds = new HashSet<>();
    blocks.stream()
        .filter(this::isWithDetails)
        .forEach(
            block -> {
              allUserIds.addAll(block.getAppointmentBlockGroup().getPhysicians());
              allUserIds.addAll(block.getAppointmentBlockGroup().getMfas());
              allUserIds.addAll(block.getAppointmentBlockGroup().getConsultants());
            });
    if (allUserIds.isEmpty()) {
      return Map.of();
    }

    GetUsersResponse getUsersResponse = userApi.getUsersBulk(new GetUsersRequest(allUserIds, true));
    return getUsersResponse.users().stream()
        .collect(Collectors.toMap(UserDto::userId, userDto -> userDto));
  }

  private boolean isWithDetails(AppointmentBlock appointmentBlock) {
    return !appointmentBlock.getAppointmentBlockEnd().isBefore(appointmentService.getStartOfWeek());
  }

  private List<AppointmentBlockDto> resolveAppointmentBlocks(
      List<AppointmentBlock> blocks, Map<UUID, UserDto> resolvedUsers) {
    Map<AppointmentBlock, List<List<AppointmentBlockSlotWithAppointment>>>
        blockToBinsWithBookedSlots =
            blocks.stream()
                .collect(
                    Collectors.toMap(
                        block -> block,
                        AppointmentBlockViewService::getBinsWithBookedAppointments));

    List<Appointment> appointments =
        blockToBinsWithBookedSlots.values().stream()
            .flatMap(Collection::stream)
            .flatMap(Collection::stream)
            .map(AppointmentBlockSlotWithAppointment::appointment)
            .filter(Objects::nonNull)
            .toList();
    Map<Appointment, AppointmentBlockSlotDto> appointmentToSlot =
        appointmentService.getAppointmentBlockSlotsForAppointments(appointments);

    return blockToBinsWithBookedSlots.entrySet().stream()
        .map(
            entry ->
                getAppointmentBlockDto(
                    entry.getKey(), entry.getValue(), appointmentToSlot, resolvedUsers))
        .sorted(Comparator.comparing(AppointmentBlockDto::start))
        .toList();
  }

  private static List<List<AppointmentBlockSlotWithAppointment>> getBinsWithBookedAppointments(
      AppointmentBlock block) {
    Set<Duration> possibleDurations = AppointmentBlockSlotUtil.getPossibleDurations(block);
    return AppointmentBlockSlotUtil.calculateBinsWithBookedSlots(block, possibleDurations);
  }

  private AppointmentBlockDto getAppointmentBlockDto(
      AppointmentBlock block,
      List<List<AppointmentBlockSlotWithAppointment>> binsWithBookedSlots,
      Map<Appointment, AppointmentBlockSlotDto> appointmentToSlot,
      Map<UUID, UserDto> allResolvedUsers) {
    AppointmentBlockGroup appointmentBlockGroup = block.getAppointmentBlockGroup();
    List<AppointmentTypeDto> appointmentTypes =
        appointmentBlockGroup.getTypes().stream()
            .map(AppointmentTypeMapper::toInterfaceType)
            .toList();
    List<AppointmentBlockBinDto> appointmentBlockBins =
        binsWithBookedSlots.stream()
            .map(bin -> getAppointmentBlockBin(block, bin, appointmentToSlot))
            .toList();

    if (isWithDetails(block)) {
      Set<UUID> userIds = new HashSet<>();
      userIds.addAll(appointmentBlockGroup.getPhysicians());
      userIds.addAll(appointmentBlockGroup.getMfas());
      userIds.addAll(appointmentBlockGroup.getConsultants());

      Map<UUID, UserDto> resolvedUsers =
          allResolvedUsers.entrySet().stream()
              .filter(entry -> userIds.contains(entry.getKey()))
              .sorted(Comparator.comparing(e -> e.getValue().firstName()))
              .collect(
                  Collectors.toMap(
                      Map.Entry::getKey,
                      Map.Entry::getValue,
                      (first, second) -> first,
                      LinkedHashMap::new));

      return new AppointmentBlockDto(
          block.getExternalId(),
          block.getAppointmentBlockStart(),
          block.getAppointmentBlockEnd(),
          appointmentTypes,
          appointmentBlockGroup.getPhysicians(),
          appointmentBlockGroup.getMfas(),
          appointmentBlockGroup.getConsultants(),
          resolvedUsers,
          block.getAppointments().size(),
          appointmentBlockBins);
    } else {
      return new AppointmentBlockDto(
          block.getExternalId(),
          block.getAppointmentBlockStart(),
          block.getAppointmentBlockEnd(),
          appointmentTypes,
          Collections.emptyList(),
          Collections.emptyList(),
          Collections.emptyList(),
          Map.of(),
          block.getAppointments().size(),
          appointmentBlockBins);
    }
  }

  private static AppointmentBlockBinDto getAppointmentBlockBin(
      AppointmentBlock block,
      List<AppointmentBlockSlotWithAppointment> binWithBookedSlots,
      Map<Appointment, AppointmentBlockSlotDto> appointmentToSlot) {
    List<AppointmentBlockSlotDto> appointmentBlockSlots = new ArrayList<>();
    binWithBookedSlots.forEach(
        slotWithAppointment ->
            appointmentBlockSlots.add(appointmentToSlot.get(slotWithAppointment.appointment())));

    List<AppointmentBlockSlot> freeTimesInBin =
        AppointmentBlockSlotUtil.FreeSlotsUtil.findFreeTimesInBin(binWithBookedSlots, block);
    freeTimesInBin.forEach(
        slot ->
            appointmentBlockSlots.add(
                new AppointmentBlockSlotDto(
                    slot.start(), slot.end(), false, null, null, null, null)));
    return new AppointmentBlockBinDto(
        appointmentBlockSlots.stream()
            .sorted(Comparator.comparing(AppointmentBlockSlotDto::start))
            .toList());
  }

  public List<AppointmentBlockSlotDto> findAppointmentsInTimeRange(
      Instant timeRangeStart, Instant timeRangeEnd) {
    appointmentService.checkAppointmentBlockViewFeatureActive();

    if (timeRangeStart == null || timeRangeEnd == null || !timeRangeStart.isBefore(timeRangeEnd)) {
      throw new BadRequestException("Invalid time range specified.");
    }
    if (ChronoUnit.DAYS.between(timeRangeStart, timeRangeEnd) > 32) {
      throw new BadRequestException("Allowed maximum days between start and end time is 32 days.");
    }
    List<Appointment> appointments =
        appointmentRepository.findAppointmentsOverlappingWithTimeRange(
            timeRangeStart, timeRangeEnd);
    return appointmentService
        .getAppointmentBlockSlotsForAppointments(appointments)
        .values()
        .stream()
        .sorted(
            Comparator.comparing(AppointmentBlockSlotDto::start)
                .thenComparing(AppointmentBlockSlotDto::appointmentId))
        .toList();
  }

  public AppointmentBlockSlotDto getAppointment(Long appointmentId) {
    Optional<Appointment> appointmentOptional = appointmentRepository.findById(appointmentId);
    if (appointmentOptional.isEmpty()) {
      throw new NotFoundException("Appointment with id " + appointmentId + " not found.");
    }
    return appointmentService
        .getAppointmentBlockSlotsForAppointments(List.of(appointmentOptional.get()))
        .values()
        .stream()
        .findFirst()
        .orElseThrow();
  }
}
