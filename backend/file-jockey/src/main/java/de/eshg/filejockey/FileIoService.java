/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey;

import static java.nio.file.StandardCopyOption.ATOMIC_MOVE;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

import de.eshg.filejockey.api.CorrelationId;
import de.eshg.filejockey.api.EquipmentSelector;
import de.eshg.filejockey.config.FileJockeyProperties;
import de.eshg.filejockey.config.FileJockeyProperties.Device;
import de.eshg.filejockey.config.FileJockeyProperties.DeviceInputFileProperties;
import de.eshg.filejockey.config.FileJockeyProperties.DeviceOutputFileProperties;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.InternalServerErrorException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.error.ServiceUnavailableException;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.MessageFormat;
import java.util.Comparator;
import java.util.List;
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

  void putInputFile(String equipmentSelectorValue, String correlationIdValue, byte[] content) {
    EquipmentSelector equipmentSelector = EquipmentSelector.of(equipmentSelectorValue);
    CorrelationId correlationId = CorrelationId.of(correlationIdValue);

    Device device = getDevice(equipmentSelector);
    if (content.length > device.maxFileSize().toBytes()) {
      throw new BadRequestException("Content too large!");
    }

    Path inputFolder = getValidInputFolder(device.input(), equipmentSelector);
    String filenameTemplate = device.input().filenameTemplate();
    String inputFilename = getInputFilename(filenameTemplate, equipmentSelector, correlationId);

    log.debug("Storing file named '{}' in folder '{}'", inputFilename, inputFolder);

    writeContent(inputFolder, inputFilename, content);
  }

  private static String getInputFilename(
      String template, EquipmentSelector equipmentSelector, CorrelationId correlationId) {
    return MessageFormat.format(template, equipmentSelector.value(), correlationId.value());
  }

  private static void writeContent(Path inputFolder, String inputFilename, byte[] content) {
    try {
      Path tempFile = Files.createTempFile(inputFolder, inputFilename + ".", ".tmp");
      Path inputFile = inputFolder.resolve(inputFilename);
      Files.write(tempFile, content);
      Files.move(tempFile, inputFile, ATOMIC_MOVE, REPLACE_EXISTING);
    } catch (IOException _) {
      throw new InternalServerErrorException("Could not write file");
    }
  }

  boolean deleteFiles(String equipmentSelectorValue, String correlationIdValue) {
    EquipmentSelector equipmentSelector = EquipmentSelector.of(equipmentSelectorValue);
    CorrelationId correlationId = CorrelationId.of(correlationIdValue);

    Device device = getDevice(equipmentSelector);
    Path inputFolder = getValidInputFolder(device.input(), equipmentSelector);
    Path outputFolder = getValidOutputFolder(device.output(), equipmentSelector);

    boolean inputDeleted =
        tryToDeleteInputFile(
            inputFolder, device.input().filenameTemplate(), equipmentSelector, correlationId);

    boolean outputDeleted = tryToDeleteOutputFiles(outputFolder, device, correlationId);

    return inputDeleted || outputDeleted;
  }

  private boolean tryToDeleteInputFile(
      Path inputFolder,
      String filenameTemplate,
      EquipmentSelector equipmentSelector,
      CorrelationId correlationId) {
    String inputFilename = getInputFilename(filenameTemplate, equipmentSelector, correlationId);
    Path inputFile = inputFolder.resolve(inputFilename);
    try {
      boolean deleted = Files.deleteIfExists(inputFile);
      if (deleted) {
        log.debug("Deleted input file: {}", inputFile);
      }
      return deleted;
    } catch (IOException e) {
      log.error("Error deleting input file: {}", inputFile, e);
      throw new InternalServerErrorException("Could not delete input file");
    }
  }

  private boolean tryToDeleteOutputFiles(
      Path outputFolder, Device device, CorrelationId correlationId) {
    String pattern = buildSearchPattern(device.output(), correlationId);
    Charset charset = device.charset();

    log.debug("Searching for files containing pattern '{}' in folder '{}'", pattern, outputFolder);

    List<Path> filesToDelete;
    try (Stream<Path> files = Files.list(outputFolder).filter(Files::isRegularFile)) {
      filesToDelete = files.filter(file -> fileContainsPattern(file, pattern, charset)).toList();
    } catch (IOException e) {
      log.error("Error scanning output folder: {}", outputFolder, e);
      throw new ServiceUnavailableException(
          "Error scanning output folder", "IOException: " + e.getMessage());
    }

    for (Path file : filesToDelete) {
      try {
        Files.deleteIfExists(file);
        log.debug("Deleted output file: {}", file);
      } catch (IOException e) {
        log.error("Error deleting output file: {}", file, e);
        throw new InternalServerErrorException("Could not delete output file");
      }
    }

    return !filesToDelete.isEmpty();
  }

  public record OutputFile(Path path, String filename) {}

  public OutputFile getOutputFile(String equipmentSelectorValue, String correlationIdValue) {
    EquipmentSelector equipmentSelector = EquipmentSelector.of(equipmentSelectorValue);
    CorrelationId correlationId = CorrelationId.of(correlationIdValue);

    Device device = getDevice(equipmentSelector);
    Path outputFolder = getValidOutputFolder(device.output(), equipmentSelector);

    long maxSizeBytes = device.maxFileSize().toBytes();
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

  private Path getValidInputFolder(
      DeviceInputFileProperties input, EquipmentSelector equipmentSelector) {
    Path inputFolder = input.folder();
    if (!Files.exists(inputFolder)
        || !Files.isDirectory(inputFolder)
        || !Files.isWritable(inputFolder)) {
      throw new ServiceUnavailableException(
          "Input folder for equipment selector '"
              + equipmentSelector.value()
              + "' does not exist or is not writable");
    }
    return inputFolder;
  }

  private Path getValidOutputFolder(
      DeviceOutputFileProperties output, EquipmentSelector equipmentSelector) {
    Path outputFolder = output.folder();
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
