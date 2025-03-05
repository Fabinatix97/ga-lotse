/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import static de.eshg.rest.service.PrivacyDocumentHelper.privacyNoticeAttachmentResponse;
import static de.eshg.rest.service.PrivacyDocumentHelper.privacyPolicyAttachmentResponse;

import de.eshg.measlesprotection.api.citizenportal.ReportCaseRequest;
import de.eshg.measlesprotection.config.MeaslesProtectionConfigService;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = OrganisationPortalController.BASE_URL)
@Tag(name = "OrganisationPortal")
public class OrganisationPortalController {
  public static final String BASE_URL = BaseUrls.MeaslesProtection.ORGANISATION_CONTROLLER;

  private final OrganisationPortalService publicMeaslesProtectionService;
  private final MeaslesProtectionConfigService measlesProtectionConfigService;

  public OrganisationPortalController(
      OrganisationPortalService publicMeaslesProtectionService,
      MeaslesProtectionConfigService measlesProtectionConfigService) {
    this.publicMeaslesProtectionService = publicMeaslesProtectionService;
    this.measlesProtectionConfigService = measlesProtectionConfigService;
  }

  @PostMapping("/report")
  @Operation(
      summary =
          "A method to report multiple affected persons belonging to a facility and open draft cases")
  public void report(@RequestBody @Valid ReportCaseRequest request) {
    publicMeaslesProtectionService.reportCases(request);
  }

  @GetMapping(path = "/documents/privacy-notice")
  @Operation(summary = "Get the privacy-notice document.")
  public ResponseEntity<Resource> getPrivacyNotice() {
    return privacyNoticeAttachmentResponse(
        measlesProtectionConfigService.getConfig().getPrivacyNotice());
  }

  @GetMapping(path = "/documents/privacy-policy")
  @Operation(summary = "Get the privacy-policy document.")
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return privacyPolicyAttachmentResponse(
        measlesProtectionConfigService.getConfig().getPrivacyPolicy());
  }
}
