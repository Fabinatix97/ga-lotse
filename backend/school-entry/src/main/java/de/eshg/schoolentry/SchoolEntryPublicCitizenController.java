/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.config.departmentinfo.DepartmentInfoConfigService;
import de.eshg.config.departmentinfo.OpeningHoursService;
import de.eshg.config.departmentinfo.PrivacyDocumentService;
import de.eshg.config.domain.OpeningHours;
import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.api.citizen.GetOpeningHoursResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Collections;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BaseUrls.SchoolEntry.PUBLIC_CITIZEN_CONTROLLER)
@Tag(name = "SchoolEntryPublicCitizen")
public class SchoolEntryPublicCitizenController {

  private final OpeningHoursService openingHoursService;
  private final PrivacyDocumentService privacyDocumentService;
  private final DepartmentInfoConfigService departmentInfoService;

  public SchoolEntryPublicCitizenController(
      OpeningHoursService openingHoursService,
      PrivacyDocumentService privacyDocumentService,
      DepartmentInfoConfigService departmentInfoService) {
    this.openingHoursService = openingHoursService;
    this.privacyDocumentService = privacyDocumentService;
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

  @GetMapping(path = "/documents/privacy-notice")
  @Operation(summary = "Get the privacy-notice document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyNotice() {
    return privacyDocumentService.getPrivacyNoticeDe();
  }

  @GetMapping(path = "/documents/privacy-policy")
  @Operation(summary = "Get the privacy-policy document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return privacyDocumentService.getPrivacyPolicyDe();
  }
}
