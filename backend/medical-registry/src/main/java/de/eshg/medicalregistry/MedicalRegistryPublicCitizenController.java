/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import static de.eshg.rest.service.PrivacyDocumentHelper.privacyNoticeAttachmentResponse;
import static de.eshg.rest.service.PrivacyDocumentHelper.privacyPolicyAttachmentResponse;
import static de.eshg.rest.service.security.config.BaseUrls.MedicalRegistry.CITIZEN_PORTAL_ENDPOINT;

import de.eshg.medicalregistry.config.MedicalRegistryProperties;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.UncheckedIOException;
import java.net.MalformedURLException;
import java.net.URI;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(CITIZEN_PORTAL_ENDPOINT)
@Tag(name = "MedicalRegistryPublicCitizen")
public class MedicalRegistryPublicCitizenController {

  public static final String DOCUMENTS_PRIVACY_NOTICE = "/privacy-notice";
  public static final String DOCUMENTS_PRIVACY_POLICY = "/privacy-policy";

  private final Resource privacyNotice;
  private final Resource privacyPolicy;

  public MedicalRegistryPublicCitizenController(
      MedicalRegistryProperties medicalRegistryProperties) {
    privacyNotice = toResource(medicalRegistryProperties.getPrivacyNoticeLocation());
    privacyPolicy = toResource(medicalRegistryProperties.getPrivacyPolicyLocation());
  }

  private static Resource toResource(URI documentLocation) {
    try {
      return new UrlResource(documentLocation);
    } catch (MalformedURLException e) {
      throw new UncheckedIOException("Unable to load resource from " + documentLocation, e);
    }
  }

  @GetMapping(path = DOCUMENTS_PRIVACY_NOTICE)
  @Operation(summary = "Get the privacy-notice document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyNotice() {
    return privacyNoticeAttachmentResponse(privacyNotice);
  }

  @GetMapping(path = DOCUMENTS_PRIVACY_POLICY)
  @Operation(summary = "Get the privacy-policy document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return privacyPolicyAttachmentResponse(privacyPolicy);
  }
}
