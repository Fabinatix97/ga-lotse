/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.file;

import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = OmsFileController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "OmsFile")
public class OmsFileController {
  public static final String BASE_URL = BaseUrls.OfficialMedicalService.EMPLOYEE_API;
  public static final String FILE_URL = "/file";

  private final OmsFileService omsFileService;

  public OmsFileController(OmsFileService omsFileService) {
    this.omsFileService = omsFileService;
  }

  @GetMapping(path = FILE_URL + "/{fileId}")
  @Operation(summary = "Download file from oms document.")
  @Transactional(readOnly = true)
  @ApiResponse(
      responseCode = "200",
      content =
          @Content(
              mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE,
              schema = @Schema(format = "binary")))
  public ResponseEntity<byte[]> getDownloadFile(@PathVariable("fileId") UUID fileId) {
    return omsFileService.downloadDocumentFileEmployee(fileId);
  }
}
