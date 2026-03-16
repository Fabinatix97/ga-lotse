/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.scheduled;

import de.eshg.filejockey.config.FileJockeyProperties;
import de.eshg.filejockey.config.FileJockeyProperties.Device;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.Clock;
import java.time.Instant;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class FileJockeyHousekeeping {

  private static final Logger log = LoggerFactory.getLogger(FileJockeyHousekeeping.class);

  private final FileJockeyProperties fileJockeyProperties;
  private final Clock clock;

  public FileJockeyHousekeeping(FileJockeyProperties fileJockeyProperties, Clock clock) {
    this.fileJockeyProperties = fileJockeyProperties;
    this.clock = clock;
  }

  @Scheduled(cron = "0 0 4 * * *")
  public void deleteOutdatedFiles() {
    Instant threshold = Instant.now(clock).minus(fileJockeyProperties.fileRetentionThreshold);

    log.info(
        "Starting deletion of outdated files - attempting to delete files created before {}",
        threshold);

    int totalDeleted = 0;
    for (Device device : fileJockeyProperties.getDevices()) {
      totalDeleted += deleteOutdatedFilesInFolder(device.input().folder(), threshold);
      totalDeleted += deleteOutdatedFilesInFolder(device.output().folder(), threshold);
    }

    log.info("{} outdated files deleted", totalDeleted);
  }

  private int deleteOutdatedFilesInFolder(Path folder, Instant threshold) {
    if (!Files.isDirectory(folder)) {
      log.warn("Skipping non-existent or inaccessible folder: {}", folder);
      return 0;
    }

    try (Stream<Path> files = Files.list(folder)) {
      return files
          .filter(Files::isRegularFile)
          .filter(file -> isOutdated(file, threshold))
          .mapToInt(this::deleteFile)
          .sum();
    } catch (IOException e) {
      log.error("Error scanning folder: {}", folder, e);
      return 0;
    }
  }

  private int deleteFile(Path file) {
    try {
      if (Files.deleteIfExists(file)) {
        log.debug("Deleted outdated file: {}", file);
        return 1;
      }
    } catch (IOException e) {
      log.error("Error deleting outdated file: {}", file, e);
    }
    return 0;
  }

  private boolean isOutdated(Path file, Instant threshold) {
    try {
      BasicFileAttributes fileAttributes = Files.readAttributes(file, BasicFileAttributes.class);
      return fileAttributes.creationTime().toInstant().isBefore(threshold);
    } catch (IOException e) {
      log.warn("Could not read creation time for: {}", file, e);
      return false;
    }
  }
}
