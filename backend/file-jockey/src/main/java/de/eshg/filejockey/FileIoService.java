/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey;

import de.eshg.filejockey.api.CorrelationId;
import de.eshg.filejockey.api.EquipmentSelector;
import de.eshg.filejockey.config.FileJockeyProperties;
import de.eshg.filejockey.config.FileJockeyProperties.Device;
import de.eshg.filejockey.config.FileJockeyProperties.DeviceOutputFileProperties;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.error.ServiceUnavailableException;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Comparator;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FileIoService {
  private static final Logger log = LoggerFactory.getLogger(FileIoService.class);

  private final FileJockeyProperties fileJockeyProperties;

  public FileIoService(FileJockeyProperties fileJockeyProperties) {
    this.fileJockeyProperties = fileJockeyProperties;
  }

  public record OutputFile(Path path, String filename) {}

  public OutputFile getOutputFile(String equipmentSelectorValue, String correlationIdValue) {
    EquipmentSelector equipmentSelector = EquipmentSelector.of(equipmentSelectorValue);
    CorrelationId correlationId = CorrelationId.of(correlationIdValue);

    Device device = getDevice(equipmentSelector);
    Path outputFolder = getValidOutputFolder(device.output(), equipmentSelector);

    long maxSizeBytes =
        fileJockeyProperties.getMaxFileSizeForDevice(device.equipmentSelector()).toBytes();
    Charset charset = device.charset();

    String pattern = buildSearchPattern(device.output(), correlationId);
    log.debug("Searching for files containing pattern '{}' in folder '{}'", pattern, outputFolder);

    Path matchingFile =
        findMatchingFile(outputFolder, pattern, correlationId, maxSizeBytes, charset);

    return readFile(matchingFile);
  }

  private Device getDevice(EquipmentSelector equipmentSelector) {
    return fileJockeyProperties
        .getDevice(equipmentSelector.value())
        .orElseThrow(
            () ->
                new NotFoundException("Unknown equipment selector: " + equipmentSelector.value()));
  }

  private Path getValidOutputFolder(
      DeviceOutputFileProperties output, EquipmentSelector equipmentSelector) {
    Path outputFolder = Path.of(output.folder().toUri());
    if (!Files.exists(outputFolder)
        || !Files.isDirectory(outputFolder)
        || !Files.isReadable(outputFolder)) {
      throw new ServiceUnavailableException(
          "Output folder for equipment selector '"
              + equipmentSelector.value()
              + "' does not exist or is not accessible");
    }
    return outputFolder;
  }

  private String buildSearchPattern(
      DeviceOutputFileProperties output, CorrelationId correlationId) {
    return output.embeddingPrefix() + correlationId.value() + output.embeddingPostfix();
  }

  private Path findMatchingFile(
      Path outputFolder,
      String pattern,
      CorrelationId correlationId,
      long maxSizeBytes,
      Charset charset) {

    try (Stream<Path> files = getCandidateFilesStream(outputFolder, maxSizeBytes)) {

      return files
          .filter(file -> fileContainsPattern(file, pattern, charset))
          .findFirst()
          .orElseThrow(
              () ->
                  new NotFoundException(
                      "No matching file found for correlation ID: " + correlationId.value()));

    } catch (IOException e) {
      log.error("Error scanning output folder: {}", outputFolder, e);
      throw new ServiceUnavailableException(
          "Error scanning output folder", "IOException: " + e.getMessage());
    }
  }

  private Stream<Path> getCandidateFilesStream(Path outputFolder, long maxSizeBytes)
      throws IOException {
    return Files.list(outputFolder)
        .filter(Files::isRegularFile)
        .filter(file -> isFileSizeAcceptable(file, maxSizeBytes))
        .sorted(Comparator.comparing(this::getFileCreationTime));
  }

  private boolean isFileSizeAcceptable(Path file, long maxSizeBytes) {
    try {
      long size = Files.size(file);
      boolean acceptable = size <= maxSizeBytes;
      if (!acceptable) {
        log.debug(
            "File '{}' size {} bytes exceeds maximum {} bytes",
            file.getFileName(),
            size,
            maxSizeBytes);
      }
      return acceptable;
    } catch (IOException e) {
      log.warn("Could not determine file size for: {}", file, e);
      return false;
    }
  }

  private boolean fileContainsPattern(Path file, String pattern, Charset charset) {
    try {
      String content = Files.readString(file, charset);
      return content.contains(pattern);
    } catch (IOException e) {
      log.warn("Could not read file content for pattern matching: {}", file, e);
      return false;
    }
  }

  private long getFileCreationTime(Path file) {
    try {
      BasicFileAttributes attrs = Files.readAttributes(file, BasicFileAttributes.class);
      return attrs.creationTime().toMillis();
    } catch (IOException e) {
      log.warn("Could not read creation time for: {}", file, e);
      return Long.MAX_VALUE;
    }
  }

  private OutputFile readFile(Path file) {
    log.info("Returning file: {}", file.getFileName());
    return new OutputFile(file, file.getFileName().toString());
  }
}
