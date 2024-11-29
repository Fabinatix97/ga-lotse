/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.rest.service.security.config.BaseUrls;
import de.eshg.schoolentry.api.citizen.GetOpeningHoursResponse;
import de.eshg.schoolentry.config.SchoolEntryProperties;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.net.MalformedURLException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BaseUrls.SchoolEntry.PUBLIC_CITIZEN_CONTROLLER)
@Tag(name = "SchoolEntryPublicCitizen")
public class SchoolEntryPublicCitizenController {

  private final Resource privacyNotice;
  private final Resource privacyPolicy;

  private final SchoolEntryProperties schoolEntryProperties;

  public SchoolEntryPublicCitizenController(SchoolEntryProperties schoolEntryProperties) {
    this.schoolEntryProperties = schoolEntryProperties;
    this.privacyNotice = toResource(schoolEntryProperties.getPrivacyNoticeLocation());
    this.privacyPolicy = toResource(schoolEntryProperties.getPrivacyPolicyLocation());
  }

  private static Resource toResource(URI documentLocation) {
    try {
      return new UrlResource(documentLocation);
    } catch (MalformedURLException e) {
      throw new RuntimeException(e);
    }
  }

  @GetMapping(path = "/opening-hours")
  @Operation(summary = "Get the official opening hours.")
  @Transactional(readOnly = true)
  public GetOpeningHoursResponse getOpeningHours() {
    SchoolEntryProperties.OpeningHours openingHours = schoolEntryProperties.getOpeningHours();
    return new GetOpeningHoursResponse(openingHours.de(), openingHours.en());
  }

  @GetMapping(path = "/documents/privacy-notice")
  @Operation(summary = "Get the privacy-notice document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyNotice() {
    return getPrivacyDocument(privacyNotice, "Datenschutz-Information.pdf");
  }

  @GetMapping(path = "/documents/privacy-policy")
  @Operation(summary = "Get the privacy-policy document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return getPrivacyDocument(privacyPolicy, "Datenschutzerklaerung.pdf");
  }

  private static ResponseEntity<Resource> getPrivacyDocument(
      Resource privacyDocument, String filename) {
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.attachment()
                .filename(filename, StandardCharsets.UTF_8)
                .build()
                .toString())
        .contentType(MediaType.APPLICATION_PDF)
        .body(privacyDocument);
  }
}
