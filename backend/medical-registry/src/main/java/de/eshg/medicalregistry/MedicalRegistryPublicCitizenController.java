/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import static de.eshg.rest.service.security.config.BaseUrls.MedicalRegistry.CITIZEN_PORTAL_ENDPOINT;

import de.eshg.config.departmentinfo.PrivacyDocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
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

  private final PrivacyDocumentService privacyDocumentService;

  public MedicalRegistryPublicCitizenController(PrivacyDocumentService privacyDocumentService) {
    this.privacyDocumentService = privacyDocumentService;
  }

  @GetMapping(path = DOCUMENTS_PRIVACY_NOTICE)
  @Operation(summary = "Get the privacy-notice document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyNotice() {
    return privacyDocumentService.getPrivacyNoticeDe();
  }

  @GetMapping(path = DOCUMENTS_PRIVACY_POLICY)
  @Operation(summary = "Get the privacy-policy document.")
  @Transactional(readOnly = true)
  public ResponseEntity<Resource> getPrivacyPolicy() {
    return privacyDocumentService.getPrivacyPolicyDe();
  }
}
