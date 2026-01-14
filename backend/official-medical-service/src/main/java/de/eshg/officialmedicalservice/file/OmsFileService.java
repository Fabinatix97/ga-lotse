/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.file;

import de.eshg.lib.procedure.model.FileTypeDto;
import de.eshg.officialmedicalservice.file.persistence.entity.OmsFile;
import de.eshg.officialmedicalservice.file.persistence.entity.OmsFileRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OmsFileService {

  private final OmsFileRepository omsFileRepository;

  public OmsFileService(OmsFileRepository omsFileRepository) {
    this.omsFileRepository = omsFileRepository;
  }

  @Transactional
  public ResponseEntity<byte[]> downloadDocumentFileEmployee(UUID fileId) {
    OmsFile omsFile = loadOmsFile(fileId);

    ContentDisposition contentDisposition =
        ContentDisposition.attachment()
            .filename(omsFile.getFileName(), StandardCharsets.UTF_8)
            .build();

    return ResponseEntity.ok()
        .contentType(getMediaType(omsFile.getFileType()))
        .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
        .body(omsFile.getContent());
  }

  private OmsFile loadOmsFile(UUID fileId) {
    return omsFileRepository
        .findById(fileId)
        .orElseThrow(() -> new NotFoundException("File not found"));
  }

  private MediaType getMediaType(FileTypeDto fileType) {
    return switch (fileType) {
      case JPEG -> MediaType.IMAGE_JPEG;
      case PNG -> MediaType.IMAGE_PNG;
      case PDF -> MediaType.APPLICATION_PDF;
      default -> throw new BadRequestException("Invalid file type");
    };
  }
}
