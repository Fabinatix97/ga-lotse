/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.document;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import de.eshg.officialmedicalservice.document.api.PatchDocumentInformationRequest;
import de.eshg.officialmedicalservice.document.api.PatchDocumentNoteRequest;
import de.eshg.officialmedicalservice.document.api.PatchDocumentReviewRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = OmsDocumentController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "OmsDocument")
public class OmsDocumentController {
  public static final String BASE_URL = BaseUrls.OfficialMedicalService.EMPLOYEE_API;
  public static final String DOCUMENT_URL = "/document";
  public static final String COMPLETE_FILE_UPLOAD_URL = "/complete-file-upload";
  public static final String NOTE_URL = "/note";
  public static final String REVIEW_URL = "/review";

  private final OmsDocumentService omsDocumentService;

  public OmsDocumentController(OmsDocumentService omsDocumentService) {
    this.omsDocumentService = omsDocumentService;
  }

  @PatchMapping(path = DOCUMENT_URL + "/{id}")
  @Operation(summary = "Updates information of one oms document")
  public void patchDocumentInformation(
      @PathVariable("id") UUID documentId,
      @Valid @RequestBody PatchDocumentInformationRequest request) {
    omsDocumentService.updateDocumentInformationEmployee(documentId, request);
  }

  @PatchMapping(
      path = DOCUMENT_URL + "/{id}" + COMPLETE_FILE_UPLOAD_URL,
      consumes = MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Completes file upload of one oms document")
  public void patchCompleteDocumentFileUpload(
      @PathVariable("id") UUID documentId,
      @RequestPart(value = "files") List<MultipartFile> files) {
    omsDocumentService.completeDocumentFileUploadEmployee(documentId, files);
  }

  @DeleteMapping(path = DOCUMENT_URL + "/{id}")
  @Operation(summary = "Deletes a document along with all files associated with it")
  public void deleteDocumentEmployee(@PathVariable("id") UUID documentId) {
    omsDocumentService.deleteDocumentEmployee(documentId);
  }

  @PatchMapping(path = DOCUMENT_URL + "/{id}" + NOTE_URL)
  @Operation(summary = "Updates note of one oms document")
  public void patchDocumentNote(
      @PathVariable("id") UUID documentId, @Valid @RequestBody PatchDocumentNoteRequest request) {
    omsDocumentService.updateDocumentNoteEmployee(documentId, request);
  }

  @PatchMapping(path = DOCUMENT_URL + "/{id}" + REVIEW_URL)
  @Operation(summary = "Accepts or rejects a submitted document")
  public void patchDocumentReview(
      @PathVariable("id") UUID documentId, @Valid @RequestBody PatchDocumentReviewRequest request) {
    omsDocumentService.reviewDocumentEmployee(documentId, request);
  }
}
