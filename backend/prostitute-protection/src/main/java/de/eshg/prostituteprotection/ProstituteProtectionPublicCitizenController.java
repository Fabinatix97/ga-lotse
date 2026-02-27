/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.config.departmentinfo.OpeningHoursService;
import de.eshg.config.domain.OpeningHours;
import de.eshg.lib.appointmentblock.AppointmentBlockAvailabilityService;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureResponse;
import de.eshg.prostituteprotection.api.ProcedureTypeDto;
import de.eshg.prostituteprotection.api.citizen.CreateCitizenProcedureRequest;
import de.eshg.prostituteprotection.api.citizen.GetOpeningHoursResponse;
import de.eshg.prostituteprotection.api.citizen.GetPublicCitizenConfigurationResponse;
import de.eshg.prostituteprotection.mapper.AppointmentMapper;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BaseUrls.ProstituteProtection.PUBLIC_CITIZEN_CONTROLLER)
@Tag(name = "ProstituteProtectionPublicCitizen")
public class ProstituteProtectionPublicCitizenController {

  private final OpeningHoursService openingHoursService;
  private final DepartmentInfoConfigService departmentInfoService;
  private final AppointmentBlockService appointmentBlockService;
  private final AppointmentBlockAvailabilityService appointmentBlockAvailabilityService;
  private final ProstituteProtectionPublicCitizenService citizenService;
  private final Clock clock;

  public ProstituteProtectionPublicCitizenController(
      OpeningHoursService openingHoursService,
      DepartmentInfoConfigService departmentInfoService,
      AppointmentBlockService appointmentBlockService,
      AppointmentBlockAvailabilityService appointmentBlockAvailabilityService,
      ProstituteProtectionPublicCitizenService citizenService,
      Clock clock) {
    this.openingHoursService = openingHoursService;
    this.departmentInfoService = departmentInfoService;
    this.appointmentBlockService = appointmentBlockService;
    this.appointmentBlockAvailabilityService = appointmentBlockAvailabilityService;
    this.citizenService = citizenService;
    this.clock = clock;
  }

  @GetMapping(path = "/department-info")
  @Operation(summary = "Get department info.")
  public GetDepartmentInfoResponse getDepartmentInfo() {
    return departmentInfoService.getDepartmentInfo();
  }

  @GetMapping(path = "/opening-hours")
  @Operation(summary = "Get the official opening hours.")
  @Transactional(readOnly = true)
  public GetOpeningHoursResponse getOpeningHours() {
    OpeningHours openingHours = openingHoursService.getConfig();
    return new GetOpeningHoursResponse(
        Collections.unmodifiableList(openingHours.getDe()),
        Collections.unmodifiableList(openingHours.getEn()));
  }

  @GetMapping(path = "/landing", produces = MediaType.TEXT_MARKDOWN_VALUE)
  @Operation(summary = "Get the landing page markdowns from the config.")
  @Transactional(readOnly = true)
  public ResponseEntity<byte[]> getLandingPageContent() {
    byte[] landingContent = citizenService.getLandingPageContent();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.TEXT_MARKDOWN);

    return ResponseEntity.ok().headers(headers).body(landingContent);
  }

  @GetMapping(path = "/configuration")
  @Operation(summary = "Get the configured properties.")
  @Transactional(readOnly = true)
  public GetPublicCitizenConfigurationResponse getPublicConfiguration() {
    return new GetPublicCitizenConfigurationResponse(
        citizenService.getOnlinePortalBookingEnabled());
  }

  @Operation(summary = "Get free appointments.")
  @GetMapping(path = "/free-appointments")
  @Transactional(readOnly = true)
  public GetFreeAppointmentsResponse getFreeAppointmentsForCitizen(
      @RequestParam(name = "procedureType") ProcedureTypeDto procedureType) {
    Instant now = Instant.now(clock);
    Instant earliestStart =
        now.plus(
            Duration.ofDays(
                appointmentBlockAvailabilityService
                    .getDefaultLeadTimes()
                    .citizenFreeAppointmentsMinLeadTime()));
    Instant latestStart =
        now.plus(
            Duration.ofDays(
                appointmentBlockAvailabilityService
                    .getDefaultLeadTimes()
                    .citizenFreeAppointmentsMaxLeadTime()));

    List<AppointmentDto> appointments =
        appointmentBlockService.getFreeAppointmentsWithAvailability(
            earliestStart,
            latestStart,
            AppointmentMapper.mapToAppointmentType(procedureType),
            null,
            true,
            null,
            null,
            null,
            null,
            null);

    return new GetFreeAppointmentsResponse(appointments);
  }

  @Operation(summary = "Save a new citizen procedure.")
  @PostMapping(path = "/procedures")
  @Transactional
  public CreateProstituteProtectionProcedureResponse createCitizenProcedure(
      @RequestBody @Valid CreateCitizenProcedureRequest request) {
    if (!citizenService.getOnlinePortalBookingEnabled()) {
      throw new BadRequestException("Appointment booking from online portal is not enabled.");
    }
    return new CreateProstituteProtectionProcedureResponse(
        citizenService.createCitizenProcedure(request));
  }
}
