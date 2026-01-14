/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.config.departmentinfo.OpeningHoursService;
import de.eshg.config.domain.OpeningHours;
import de.eshg.lib.appointmentblock.AppointmentBlockService;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.api.GetFreeAppointmentsResponse;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureResponse;
import de.eshg.prostituteprotection.api.citizen.CreateCitizenProcedureRequest;
import de.eshg.prostituteprotection.api.citizen.GetOpeningHoursResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Collections;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BaseUrls.ProstituteProtection.PUBLIC_CITIZEN_CONTROLLER)
@Tag(name = "ProstituteProtectionPublicCitizen")
public class ProstituteProtectionPublicCitizenController {

  private final OpeningHoursService openingHoursService;
  private final DepartmentInfoConfigService departmentInfoService;
  private final AppointmentBlockService appointmentBlockService;
  private final ProstituteProtectionPublicCitizenService citizenService;

  public ProstituteProtectionPublicCitizenController(
      OpeningHoursService openingHoursService,
      DepartmentInfoConfigService departmentInfoService,
      AppointmentBlockService appointmentBlockService,
      ProstituteProtectionPublicCitizenService citizenService) {
    this.openingHoursService = openingHoursService;
    this.departmentInfoService = departmentInfoService;
    this.appointmentBlockService = appointmentBlockService;
    this.citizenService = citizenService;
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

  @Operation(summary = "Get free appointments.")
  @GetMapping(path = "/free-appointments")
  @Transactional(readOnly = true)
  public GetFreeAppointmentsResponse getFreeAppointmentsForCitizen() {
    List<AppointmentDto> appointments =
        appointmentBlockService.getFreeAppointments(
            null, null, AppointmentType.PROSTITUTE_PROTECTION_CONSULTATION, null, null);

    return new GetFreeAppointmentsResponse(appointments);
  }

  @Operation(summary = "Save a new citizen procedure.")
  @PostMapping(path = "/procedures")
  @Transactional
  public CreateProstituteProtectionProcedureResponse createCitizenProcedure(
      @RequestBody @Valid CreateCitizenProcedureRequest request) {
    return new CreateProstituteProtectionProcedureResponse(
        citizenService.createCitizenProcedure(request));
  }
}
