/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.nio.charset.StandardCharsets;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "FileIo")
public class FileIoController implements FileIoApi {

  private final FileIoService fileIoService;

  public FileIoController(FileIoService fileIoService) {
    this.fileIoService = fileIoService;
  }

  // TODO: Maybe use InputStreamResource instead of byte[]
  // [internal gitlab link]
  @Override
  public ResponseEntity<Void> putInputFile(
      String equipmentSelector, String correlationId, byte[] content) {
    fileIoService.putInputFile(equipmentSelector, correlationId, content);

    return ResponseEntity.ok().build();
  }

  @Override
  public ResponseEntity<Resource> getOutputFile(String equipmentSelector, String correlationId) {
    FileIoService.OutputFile file = fileIoService.getOutputFile(equipmentSelector, correlationId);

    ContentDisposition contentDisposition =
        ContentDisposition.attachment().filename(file.filename(), StandardCharsets.UTF_8).build();

    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
        .body(new FileSystemResource(file.path()));
  }

  @Override
  public ResponseEntity<Void> deleteFiles(String equipmentSelector, String correlationId) {
    boolean anyDeleted = fileIoService.deleteFiles(equipmentSelector, correlationId);

    return anyDeleted ? ResponseEntity.ok().build() : ResponseEntity.noContent().build();
  }
}
