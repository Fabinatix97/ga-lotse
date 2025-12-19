/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.config.departmentinfo.OpeningHoursService;
import de.eshg.config.domain.OpeningHours;
import de.eshg.prostituteprotection.api.citizen.GetOpeningHoursResponse;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Collections;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BaseUrls.ProstituteProtection.PUBLIC_CITIZEN_CONTROLLER)
@Tag(name = "ProstituteProtectionPublicCitizen")
public class ProstituteProtectionPublicCitizenController {

  private final OpeningHoursService openingHoursService;
  private final DepartmentInfoConfigService departmentInfoService;

  public ProstituteProtectionPublicCitizenController(
      OpeningHoursService openingHoursService, DepartmentInfoConfigService departmentInfoService) {
    this.openingHoursService = openingHoursService;
    this.departmentInfoService = departmentInfoService;
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
}
