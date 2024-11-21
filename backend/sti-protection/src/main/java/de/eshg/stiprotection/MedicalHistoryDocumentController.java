/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = MedicalHistoryDocumentController.BASE_URL)
@Tag(name = "MedicalHistoryDocument")
public class MedicalHistoryDocumentController {
  public static final String BASE_URL =
      BaseUrls.StiProtection.PROCEDURE_CONTROLLER + "/medical-history-document";

  private final Resource consultationDEDocument;
  private final Resource consultationENDocument;
  private final Resource sexworkDEDocument;
  private final Resource sexworkENDocument;

  public MedicalHistoryDocumentController(
      @Value("${de.eshg.sti-protection.medical-history.consultation-de-location}")
          Resource consultationDEDocument,
      @Value("${de.eshg.sti-protection.medical-history.consultation-en-location}")
          Resource consultationENDocument,
      @Value("${de.eshg.sti-protection.medical-history.sexwork-de-location}")
          Resource sexworkDEDocument,
      @Value("${de.eshg.sti-protection.medical-history.sexwork-en-location}")
          Resource sexworkENDocument) {
    this.consultationDEDocument = consultationDEDocument;
    this.consultationENDocument = consultationENDocument;
    this.sexworkDEDocument = sexworkDEDocument;
    this.sexworkENDocument = sexworkENDocument;
  }

  @GetMapping(path = "/consultation-de")
  @Operation(summary = "Get the printable document for sti hiv consultation in DE locale.")
  public ResponseEntity<Resource> getConsulatationDEDocument() {
    return getDocument(consultationDEDocument);
  }

  @GetMapping(path = "/consultation-en")
  @Operation(summary = "Get the printable document for sti hiv consultation in EN locale.")
  public ResponseEntity<Resource> getConsulatationENDocument() {
    return getDocument(consultationENDocument);
  }

  @GetMapping(path = "/sexwork-de")
  @Operation(summary = "Get the printable document for sexwork in DE locale.")
  public ResponseEntity<Resource> getSexworkDEDocument() {
    return getDocument(sexworkDEDocument);
  }

  @GetMapping(path = "/sexwork-en")
  @Operation(summary = "Get the printable document for sexwork in EN locale.")
  public ResponseEntity<Resource> getSexworkENDocument() {
    return getDocument(sexworkENDocument);
  }

  private static ResponseEntity<Resource> getDocument(Resource document) {
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, fileAttachment(document.getFilename()).toString())
        .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
        .body(document);
  }

  private static ContentDisposition fileAttachment(String filename) {
    return file(filename, ContentDisposition.attachment());
  }

  private static ContentDisposition file(String filename, ContentDisposition.Builder builder) {
    return builder.name("file").filename(filename).build();
  }
}
