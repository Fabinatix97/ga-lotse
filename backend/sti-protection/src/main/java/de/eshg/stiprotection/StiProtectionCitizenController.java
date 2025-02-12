/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.MappingUtil;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.stiprotection.api.citizen.GetDepartmentInfoRequest;
import de.eshg.stiprotection.api.citizen.GetOpeningHoursRequest;
import de.eshg.stiprotection.api.citizen.GetOpeningHoursResponse;
import de.eshg.stiprotection.api.citizen.StiAppointmentTypeDto;
import de.eshg.stiprotection.mapper.ConcernMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = StiProtectionCitizenController.BASE_URL)
@Tag(name = "StiProtectionCitizen")
public class StiProtectionCitizenController {

  private static final Logger log = LoggerFactory.getLogger(StiProtectionCitizenController.class);

  public static final String BASE_URL = BaseUrls.StiProtection.CITIZEN_PUBLIC_CONTROLLER;

  private final DepartmentInfoService departmentInfoService;
  private final AppointmentBlockService appointmentBlockService;
  private final Clock clock;

  public StiProtectionCitizenController(
      DepartmentInfoService departmentInfoService,
      AppointmentBlockService appointmentBlockService,
      Clock clock) {
    this.departmentInfoService = departmentInfoService;
    this.appointmentBlockService = appointmentBlockService;
    this.clock = clock;
  }

  @GetMapping("/department-info")
  @Operation(summary = "Get department info")
  @Transactional(readOnly = true)
  public GetDepartmentInfoResponse getDepartmentInfo(
      @Valid @RequestBody GetDepartmentInfoRequest request) {
    return departmentInfoService.getDepartmentInfo(ConcernMapper.toDatabaseType(request.concern()));
  }

  @GetMapping("/opening-hours")
  @Operation(summary = "Get opening hours")
  @Transactional(readOnly = true)
  public GetOpeningHoursResponse getOpeningHours(
      @Valid @RequestBody GetOpeningHoursRequest request) {
    return departmentInfoService.getOpeningHours(ConcernMapper.toDatabaseType(request.concern()));
  }

  @Operation(summary = "Get free appointments for an appointment type.")
  @GetMapping("/free-appointments")
  @Transactional(readOnly = true)
  public GetFreeAppointmentsResponse getFreeAppointmentsForCitizen(
      @RequestParam(name = "appointmentType") @NotNull StiAppointmentTypeDto appointmentType,
      @RequestParam(name = "earliestDate", required = false) Instant earliestDate) {

    if (earliestDate != null && earliestDate.isBefore(Instant.now(clock))) {
      log.warn("Received earliestDate {} is in the past. Adjusting to current time.", earliestDate);
      earliestDate = Instant.now(clock);
    }

    List<AppointmentDto> appointments =
        appointmentBlockService.getFreeAppointments(
            earliestDate,
            null,
            MappingUtil.mapEnum(AppointmentType.class, appointmentType),
            null,
            null);

    return new GetFreeAppointmentsResponse(appointments);
  }
}
