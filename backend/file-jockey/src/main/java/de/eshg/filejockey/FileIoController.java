/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey;

import static de.eshg.rest.service.security.config.BaseUrls.FileJockey.FILE_IO_API;

import de.eshg.filejockey.api.CorrelationId;
import de.eshg.filejockey.api.EquipmentSelector;
import de.eshg.rest.service.error.BadRequestException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotEmpty;
import java.nio.charset.StandardCharsets;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = FILE_IO_API)
@Tag(name = "FileIo")
public class FileIoController {

  public static final String FILE_IO_URL = "/{equipmentSelector}/{correlationId}";
  public static final String FILE_IO_INPUT_URL = "/{equipmentSelector}/{correlationId}/input";
  public static final String FILE_IO_OUTPUT_URL = "/{equipmentSelector}/{correlationId}/output";

  private final FileIoService fileIoService;

  public FileIoController(FileIoService fileIoService) {
    this.fileIoService = fileIoService;
  }

  // TODO: Maybe use InputStreamResource instead of byte[]
  // [internal gitlab link]
  @PutMapping(path = FILE_IO_INPUT_URL, consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
  @Operation(
      summary =
          "Upload input file for given equipment selector and correlation ID. "
              + "Tolerates repeated calls with the same content.")
  @ApiResponse(responseCode = "200", description = "File uploaded")
  @ApiResponse(responseCode = "429", description = "Too many requests")
  ResponseEntity<Void> putInputFile(
      @PathVariable("equipmentSelector") String equipmentSelector,
      @PathVariable("correlationId") String correlationId,
      @RequestBody @NotEmpty(message = "Request body is empty.") byte[] content) {

    validateEquipmentSelector(equipmentSelector);
    validateCorrelationId(correlationId);

    fileIoService.putInputFile(equipmentSelector, correlationId, content);

    return ResponseEntity.ok().build();
  }

  @GetMapping(path = FILE_IO_OUTPUT_URL)
  @Operation(
      summary =
          "Download output file for given equipment selector and correlation ID. "
              + "Scans the equipment output folder for files containing the correlation ID. "
              + "Returns the oldest matching file if multiple matches are found.")
  @ApiResponse(
      responseCode = "200",
      description = "File found and returned",
      content = @Content(mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE))
  @ApiResponse(
      responseCode = "400",
      description = "Invalid correlation ID format",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
  @ApiResponse(
      responseCode = "404",
      description =
          "No matching file found for the given correlation ID, or the equipment selector is unknown",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
  @ApiResponse(
      responseCode = "503",
      description = "Output folder does not exist or is not accessible",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
  @ApiResponse(responseCode = "429", description = "Too many requests")
  public ResponseEntity<Resource> getOutputFile(
      @PathVariable("equipmentSelector") String equipmentSelector,
      @PathVariable("correlationId") String correlationId) {

    validateEquipmentSelector(equipmentSelector);
    validateCorrelationId(correlationId);

    FileIoService.OutputFile file = fileIoService.getOutputFile(equipmentSelector, correlationId);

    ContentDisposition contentDisposition =
        ContentDisposition.attachment().filename(file.filename(), StandardCharsets.UTF_8).build();

    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
        .body(new FileSystemResource(file.path()));
  }

  @DeleteMapping(path = FILE_IO_URL)
  @Operation(
      summary =
          "Delete input and output files for given equipment selector and correlation ID. "
              + "Scans the input folder by filename template and the output folder for files "
              + "containing the correlation ID embedding (prefix+correlationId+postfix).")
  @ApiResponse(responseCode = "200", description = "File(s) deleted")
  @ApiResponse(responseCode = "204", description = "No files found to delete")
  @ApiResponse(responseCode = "400", description = "Invalid correlation ID format")
  @ApiResponse(responseCode = "404", description = "The equipment selector is unknown")
  @ApiResponse(
      responseCode = "503",
      description = "Input or output folder does not exist or is not accessible")
  @ApiResponse(responseCode = "429", description = "Too many requests")
  ResponseEntity<Void> deleteFiles(
      @PathVariable("equipmentSelector") String equipmentSelector,
      @PathVariable("correlationId") String correlationId) {

    validateEquipmentSelector(equipmentSelector);
    validateCorrelationId(correlationId);

    boolean anyDeleted = fileIoService.deleteFiles(equipmentSelector, correlationId);

    return anyDeleted ? ResponseEntity.ok().build() : ResponseEntity.noContent().build();
  }

  private static void validateEquipmentSelector(String value) {
    if (value == null || value.isBlank()) {
      throw new BadRequestException(EquipmentSelector.EMPTY_MESSAGE);
    }
  }

  private static void validateCorrelationId(String value) {
    if (value == null || value.isBlank()) {
      throw new BadRequestException(CorrelationId.EMPTY_MESSAGE);
    }
    if (!CorrelationId.PATTERN.matcher(value).matches()) {
      throw new BadRequestException(CorrelationId.VALIDATION_MESSAGE);
    }
  }
}
