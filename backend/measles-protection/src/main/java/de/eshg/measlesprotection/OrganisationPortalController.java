/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection;

import de.eshg.measlesprotection.api.citizenportal.ReportCaseRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
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
  private final Resource privacyNotice;
  private final Resource privacyPolicy;

  public OrganisationPortalController(
      OrganisationPortalService publicMeaslesProtectionService,
      @Value("${de.eshg.measles-protection.privacy-notice-location}") Resource privacyNotice,
      @Value("${de.eshg.measles-protection.privacy-policy-location}") Resource privacyPolicy) {
    this.publicMeaslesProtectionService = publicMeaslesProtectionService;
    this.privacyNotice = privacyNotice;
    this.privacyPolicy = privacyPolicy;
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
    return getPrivacyDocument(privacyNotice);
  }

  @GetMapping(path = "/documents/privacy-policy")
  @Operation(summary = "Get the privacy-policy document.")
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return getPrivacyDocument(privacyPolicy);
  }

  private static ResponseEntity<Resource> getPrivacyDocument(Resource privacyDocument) {
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            fileAttachment(privacyDocument.getFilename()).toString())
        .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
        .body(privacyDocument);
  }

  private static ContentDisposition fileAttachment(String filename) {
    return file(filename, ContentDisposition.attachment());
  }

  private static ContentDisposition file(String filename, ContentDisposition.Builder builder) {
    return builder.name("file").filename(filename).build();
  }
}
