/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist;

import de.eshg.inspection.checklist.api.GetChecklistsResponse;
import de.eshg.inspection.checklist.api.UploadMediaFileRequestDto;
import de.eshg.inspection.checklist.api.update.UpdateChecklistRequest;
import de.eshg.inspection.checklist.api.update.UpdateChecklistResponse;
import de.eshg.inspection.common.persistence.MediaFile;
import de.eshg.inspection.inspection.InspectionService;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = ChecklistController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Checklist")
public class ChecklistController {
  public static final String BASE_URL = BaseUrls.Inspection.CHECKLIST_CONTROLLER;
  public static final String BASE_URL_FILE = "/file";

  private final InspectionService inspectionService;
  private final MediaFileService mediaFileService;

  public ChecklistController(
      InspectionService inspectionService, MediaFileService mediaFileService) {
    this.inspectionService = inspectionService;
    this.mediaFileService = mediaFileService;
  }

  @GetMapping(path = "/{inspectionExternalId}")
  @Operation(summary = "Load the checklists for the inspection with the given inspectionExternalId")
  @Transactional(readOnly = true)
  @NotNull
  public GetChecklistsResponse getChecklists(
      @PathVariable("inspectionExternalId") UUID inspectionExternalId) {
    return inspectionService.getChecklists(inspectionExternalId);
  }

  @PatchMapping(path = "/{inspectionExternalId}/checklist/{checklistId}")
  @Operation(summary = "Update the data for a checklist of an inspection")
  @Transactional
  @NotNull
  public UpdateChecklistResponse updateChecklist(
      @PathVariable("inspectionExternalId") UUID inspectionExternalId,
      @PathVariable("checklistId") UUID checklistId,
      @Valid @RequestBody UpdateChecklistRequest request) {
    return inspectionService.updateChecklist(inspectionExternalId, checklistId, request);
  }

  @PatchMapping(path = BASE_URL_FILE + "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Upload new file for a checklist", operationId = "checklistUploadFile")
  @Transactional
  public UpdateChecklistResponse uploadFile(
      @RequestPart("file") MultipartFile file,
      @RequestPart("uploadMediaFileRequest") @Valid
          UploadMediaFileRequestDto uploadMediaFileRequest) {
    return mediaFileService.saveFile(file, uploadMediaFileRequest);
  }

  @GetMapping(
      path = BASE_URL_FILE + "/{externalId}",
      produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
  @Operation(summary = "Get a file by its external ID", operationId = "checklistGetFile")
  @Transactional(readOnly = true)
  public ResponseEntity<InputStreamResource> getFile(@PathVariable("externalId") UUID externalId) {
    MediaFile file = mediaFileService.load(externalId);

    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            ContentDisposition.inline()
                .name("filename")
                .filename(file.getFileName())
                .build()
                .toString())
        .header(HttpHeaders.CONTENT_TYPE, file.getMediaType())
        .contentLength(file.getFileSize())
        .body(mediaFileService.loadContent(file));
  }

  @DeleteMapping("/{inspectionExternalId}" + BASE_URL_FILE + "/{externalId}")
  @Operation(
      summary = "Delete a file by inspection and its external ID",
      operationId = "checklistDeleteFile")
  @Transactional
  public void deleteFile(
      @PathVariable("inspectionExternalId") UUID inspectionExternalId,
      @PathVariable("externalId") UUID externalId) {
    mediaFileService.delete(inspectionExternalId, externalId);
  }
}
