/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import de.eshg.auditlog.AddAuditLogFileRequest;
import de.eshg.auditlog.AuditLogArchivingApi;
import de.eshg.auditlog.AuditLogSource;
import de.eshg.lib.auditlog.config.AuditLogConfig;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Clock;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.FileSystemUtils;

@Component
public class AuditLogArchiving {

  private static final org.slf4j.Logger log =
      org.slf4j.LoggerFactory.getLogger(AuditLogArchiving.class);

  private final AuditLogArchivingApi auditLogArchivingApi;
  private final AuditLogConfig auditLogConfig;
  private final AuditLogSource auditLogSource;
  private final Clock clock;
  private final ModuleClientAuthenticator moduleClientAuthenticator;

  public AuditLogArchiving(
      AuditLogArchivingApi auditLogArchivingApi,
      AuditLogConfig auditLogConfig,
      AuditLogSource auditLogSource,
      Clock clock,
      ModuleClientAuthenticator moduleClientAuthenticator) {
    this.auditLogArchivingApi = auditLogArchivingApi;
    this.auditLogConfig = auditLogConfig;
    this.auditLogSource = auditLogSource;
    this.clock = clock;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
  }

  @Scheduled(cron = "${de.eshg.auditlog.archiving.schedule:@daily}")
  public void runArchivingJob() {
    moduleClientAuthenticator.doWithModuleClientAuthentication(this::archiveOldAuditlogFiles);
  }

  private void archiveOldAuditlogFiles() {
    log.info("Starting archiving of old audit log files");

    Path logOutputDir = auditLogConfig.getLogOutputDir();
    log.debug("Using log output directory {}", logOutputDir);

    List<Path> candidates = getCandidates(logOutputDir);

    if (log.isInfoEnabled()) {
      List<String> oldAuditLogFilesNames =
          candidates.stream().map(Path::getFileName).map(Path::toString).toList();
      log.info(
          "Found {} audit log directories for archiving {}",
          candidates.size(),
          !oldAuditLogFilesNames.isEmpty() ? oldAuditLogFilesNames : "");
    }

    for (Path candidate : candidates) {
      archive(candidate);
    }

    log.info("Finished archiving of old audit log files");
  }

  private List<Path> getCandidates(Path logOutputDir) {
    try (Stream<Path> paths = Files.list(logOutputDir)) {
      return paths.filter(Files::isDirectory).filter(this::isOldAuditLogDirectory).toList();
    } catch (IOException e) {
      throw new AuditLoggerException("Exception occured while reading auditlog root directory.", e);
    }
  }

  private boolean isOldAuditLogDirectory(Path path) {
    try {
      LocalDate localDate =
          LocalDate.parse(path.getFileName().toString(), DateTimeFormatter.ISO_LOCAL_DATE);
      return localDate.isBefore(LocalDate.now(clock));
    } catch (DateTimeParseException e) {
      log.error("Failed to parse date from audit log directory name %s".formatted(path), e);
      return false;
    }
  }

  private void archive(Path auditLogDirectory) {
    try {
      final LocalDate auditLogDate =
          LocalDate.parse(
              auditLogDirectory.getFileName().toString(), DateTimeFormatter.ISO_LOCAL_DATE);
      auditLogArchivingApi.addAuditlogFile(
          new AddAuditLogFileRequest(auditLogDate, auditLogSource), mergeFiles(auditLogDirectory));
      log.info("Archived audit log directory for {}", auditLogDate);

      FileSystemUtils.deleteRecursively(auditLogDirectory);
      log.info("Deleted local audit log directory for {}", auditLogDate);
    } catch (Exception e) {
      log.error(
          "Error while trying to archive audit log directory {}. Resuming...",
          auditLogDirectory,
          e);
    }
  }

  private static AuditLogFile mergeFiles(Path directory) throws IOException {
    try (Stream<Path> originalFiles = Files.list(directory);
        ByteArrayOutputStream mergedFileStream = new ByteArrayOutputStream()) {

      for (Path originalFile : sortedByFilename(originalFiles)) {
        Files.copy(originalFile, mergedFileStream);
      }
      return new AuditLogFile(directory.getFileName().toString(), mergedFileStream.toByteArray());
    }
  }

  private static List<Path> sortedByFilename(Stream<Path> files) {
    return files
        .filter(Files::isRegularFile)
        .sorted(Comparator.comparing(p -> p.getFileName().toString()))
        .toList();
  }
}
