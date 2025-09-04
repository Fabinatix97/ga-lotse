/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.appointmentblock.api.AppointmentBlockDto;
import de.eshg.lib.appointmentblock.api.AppointmentBlockPaginationAndSortParameters;
import de.eshg.lib.appointmentblock.api.AppointmentBlockSlotDto;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.api.CreateAppointmentBlockGroupResponse;
import de.eshg.lib.appointmentblock.api.CreateDailyAppointmentBlockGroupRequest;
import de.eshg.lib.appointmentblock.api.GetAppointmentBlockGroupDto;
import de.eshg.lib.appointmentblock.api.GetAppointmentBlockGroupsResponse;
import de.eshg.lib.appointmentblock.api.GetAppointmentBlocksResponse;
import de.eshg.lib.appointmentblock.api.GetAppointmentsResponse;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.lib.appointmentblock.api.UpdateAppointmentBlockRequest;
import de.eshg.lib.appointmentblock.api.ValidateAppointmentBlockGroupResponse;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentTypeHolder;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppointmentBlockController.BASE_URL)
@Tag(name = "AppointmentBlock")
public class AppointmentBlockController {

  static final String BASE_URL = BaseUrls.LibAppointmentBlock.APPOINTMENT_BLOCK_API;

  private final AppointmentBlockService appointmentBlockService;
  private final AppointmentBlockViewService appointmentBlockViewService;

  public AppointmentBlockController(
      AppointmentBlockService appointmentBlockService,
      AppointmentBlockViewService appointmentBlockViewService) {
    this.appointmentBlockService = appointmentBlockService;
    this.appointmentBlockViewService = appointmentBlockViewService;
  }

  @Operation(summary = "Create appointment group with blocks for week days.")
  @PostMapping("/daily-appointment-block-groups")
  @Transactional
  public CreateAppointmentBlockGroupResponse createDailyAppointmentBlocksForGroup(
      @Valid @RequestBody CreateDailyAppointmentBlockGroupRequest request) {

    return appointmentBlockService.createDailyAppointmentBlocksForGroup(request);
  }

  @Operation(summary = "Validate appointment group with blocks for week days.")
  @PostMapping("/daily-appointment-block-groups/validate")
  @Transactional
  public ValidateAppointmentBlockGroupResponse validateDailyAppointmentBlocksForGroup(
      @Valid @RequestBody CreateDailyAppointmentBlockGroupRequest request) {

    return appointmentBlockService.validateDailyAppointmentBlocksForGroup(request);
  }

  @Operation(summary = "Get all appointment block groups.")
  @GetMapping("/appointment-block-groups")
  @Transactional(readOnly = true)
  public GetAppointmentBlockGroupsResponse getAppointmentBlockGroups(
      @InlineParameterObject @ParameterObject @Valid
          AppointmentBlockPaginationAndSortParameters paginationAndSortParameters) {

    PagedAppointmentBlockGroups pagedAppointmentBlockGroups =
        appointmentBlockService.findFutureAppointmentBlockGroups(paginationAndSortParameters);
    List<GetAppointmentBlockGroupDto> appointmentBlockGroups =
        pagedAppointmentBlockGroups.appointmentBlockGroupDataPage().stream()
            .map(AppointmentMapper::mapAppointmentBlockGroupToDto)
            .toList();
    return new GetAppointmentBlockGroupsResponse(
        appointmentBlockGroups,
        pagedAppointmentBlockGroups.totalNumberOfAppointmentBlockGroupData());
  }

  @Operation(summary = "Get appointment blocks in a certain time range (one week)")
  @GetMapping("/overview")
  @Transactional(readOnly = true)
  public GetAppointmentBlocksResponse getAppointmentBlocks(
      @RequestParam(name = "timeRangeStart") Instant timeRangeStart,
      @RequestParam(name = "timeRangeEnd") Instant timeRangeEnd) {

    List<AppointmentBlockDto> blocks =
        appointmentBlockViewService.findAppointmentBlocksInTimeRange(timeRangeStart, timeRangeEnd);
    return new GetAppointmentBlocksResponse(blocks);
  }

  @Operation(summary = "Get appointment block")
  @GetMapping("/{appointmentBlockId}")
  @Transactional(readOnly = true)
  public AppointmentBlockDto getAppointmentBlock(
      @PathVariable("appointmentBlockId") UUID appointmentBlockId) {
    return appointmentBlockViewService.getAppointmentBlock(appointmentBlockId);
  }

  @Operation(summary = "Update appointment block")
  @PutMapping("/{appointmentBlockId}")
  @Transactional()
  public AppointmentBlockDto updateAppointmentBlock(
      @PathVariable("appointmentBlockId") UUID appointmentBlockId,
      @Valid @RequestBody UpdateAppointmentBlockRequest request) {

    AppointmentBlock appointmentBlock =
        appointmentBlockService.findAppointmentBlockForUpdate(appointmentBlockId);
    Instant requestedStart = request.start();
    Instant requestedEnd = request.end();

    if (requestedStart.isBefore(appointmentBlock.getAppointmentBlockStart())
        || requestedEnd.isAfter(appointmentBlock.getAppointmentBlockEnd())) {
      throw new BadRequestException(
          "Start or end are not in the time slot of the appointment block");
    }
    if (requestedEnd.isBefore(requestedStart)) {
      throw new BadRequestException(
          "AppointmentBlockGroup end time of day must be after start time of day.");
    }

    Duration appointmentBlockLength = Duration.between(requestedStart, requestedEnd);
    List<AppointmentTypeHolder> appointmentTypeHolders =
        appointmentBlock.getAppointmentBlockGroup().getAppointmentTypeHolders();
    Duration minimalDurationForBlock =
        appointmentBlockService.calculateShortestDuration(appointmentTypeHolders);
    if (appointmentBlockLength.compareTo(minimalDurationForBlock) < 0) {
      throw new BadRequestException(
          "AppointmentBlockLength must be at least %s".formatted(minimalDurationForBlock));
    }

    Set<Appointment> appointments = appointmentBlock.getAppointments();
    if (!appointments.isEmpty()) {
      Instant earliestBooked =
          appointments.stream().map(Appointment::getAppointmentStart).sorted().toList().getFirst();

      Instant latestBooked =
          appointments.stream().map(Appointment::getAppointmentEnd).sorted().toList().getLast();

      if (earliestBooked.isBefore(requestedStart) || latestBooked.isAfter(requestedEnd)) {
        throw new BadRequestException("Start or end time is during booked appointment");
      }
    }

    appointmentBlockService.updateAppointmentBlock(appointmentBlock, request);
    return appointmentBlockViewService.getAppointmentBlock(appointmentBlockId);
  }

  @Operation(summary = "Get appointments in a certain time range (one month)")
  @GetMapping("/appointment/overview")
  @Transactional(readOnly = true)
  public GetAppointmentsResponse getAppointments(
      @RequestParam(name = "timeRangeStart") Instant timeRangeStart,
      @RequestParam(name = "timeRangeEnd") Instant timeRangeEnd) {

    List<AppointmentBlockSlotDto> appointments =
        appointmentBlockViewService.findAppointmentsInTimeRange(timeRangeStart, timeRangeEnd);
    return new GetAppointmentsResponse(appointments);
  }

  @Operation(summary = "Get appointment")
  @GetMapping("/appointment/{appointmentId}")
  @Transactional(readOnly = true)
  public AppointmentBlockSlotDto getAppointment(@PathVariable("appointmentId") Long appointmentId) {
    return appointmentBlockViewService.getAppointment(appointmentId);
  }

  @Operation(summary = "Get free appointments for an appointment type.")
  @GetMapping("/free-appointments")
  @Transactional(readOnly = true)
  public GetFreeAppointmentsResponse getFreeAppointments(
      @RequestParam(name = "appointmentType") AppointmentTypeDto appointmentType,
      @RequestParam(name = "earliestDate", required = false) Instant earliestDate,
      @RequestParam(name = "physicianId", required = false) UUID physicianId) {
    List<AppointmentDto> appointments =
        appointmentBlockService.getFreeAppointments(
            earliestDate,
            null,
            MappingUtil.mapEnum(AppointmentType.class, appointmentType),
            null,
            physicianId);

    return new GetFreeAppointmentsResponse(appointments);
  }

  @Operation(summary = "Delete appointment block.")
  @DeleteMapping("/{appointmentBlockId}")
  @Transactional
  public void deleteAppointmentBlock(@PathVariable("appointmentBlockId") UUID appointmentBlockId) {
    appointmentBlockService.deleteAppointmentBlock(appointmentBlockId);
  }
}
