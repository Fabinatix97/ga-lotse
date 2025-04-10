/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.api.commons.InlineParameterObject;
import de.eshg.lib.appointmentblock.api.AppointmentBlockPaginationAndSortParameters;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.api.CreateAppointmentBlockGroupResponse;
import de.eshg.lib.appointmentblock.api.CreateDailyAppointmentBlockGroupRequest;
import de.eshg.lib.appointmentblock.api.GetAppointmentBlockGroupDto;
import de.eshg.lib.appointmentblock.api.GetAppointmentBlockGroupsResponse;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.lib.appointmentblock.api.ValidateAppointmentBlockGroupResponse;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

  public AppointmentBlockController(AppointmentBlockService appointmentBlockService) {
    this.appointmentBlockService = appointmentBlockService;
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
