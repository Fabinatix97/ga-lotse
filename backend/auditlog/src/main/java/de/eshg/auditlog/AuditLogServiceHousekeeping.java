/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import de.eshg.auditlog.domain.model.GrantedAccessRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;
import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.FileSystemUtils;

@Component
class AuditLogServiceHousekeeping {

  private static final Logger log = LoggerFactory.getLogger(AuditLogServiceHousekeeping.class);

  private final Clock clock;
  private final AuditLogServiceConfig auditLogServiceConfig;
  private final GrantedAccessRepository grantedAccessRepository;

  public AuditLogServiceHousekeeping(
      Clock clock,
      AuditLogServiceConfig auditLogServiceConfig,
      GrantedAccessRepository grantedAccessRepository) {
    this.clock = clock;
    this.auditLogServiceConfig = auditLogServiceConfig;
    this.grantedAccessRepository = grantedAccessRepository;
  }

  @Scheduled(cron = "${de.eshg.auditlog.housekeeping.schedule:@daily}")
  @SchedulerLock(
      name = "AuditlogAuditLogServiceHousekeeping",
      lockAtMostFor = "${de.eshg.auditlog.housekeeping.lock-at-most-for:23h}")
  void performHousekeeping() {
    LockAssert.assertLocked();
    deleteExpiredGrants();
    deleteOldAuditlogs();
  }

  private void deleteOldAuditlogs() {
    Path logStorageDir = auditLogServiceConfig.getLogStorageDir();
    if (!Files.exists(logStorageDir)) {
      log.error(
          "Housekeeping is disabled because the log storage dir {} does not exist (yet)",
          logStorageDir);
    }

    log.info("Starting auditlog housekeeping for log storage {}", log);
    int retentionPeriodDays = auditLogServiceConfig.getRetentionPeriodDays();
    LocalDate cutoffDate = LocalDate.now(clock).minusDays(retentionPeriodDays);
    log.info(
        "Deleting auditlog files before {} (today - {} days)", cutoffDate, retentionPeriodDays);

    for (AuditLogSource source : AuditLogSource.values()) {
      Path serviceSpecificLogStorageDir = logStorageDir.resolve(source.name());

      try (Stream<Path> pathStream = Files.list(serviceSpecificLogStorageDir)) {
        List<Path> dailyLogDirsForDeletion =
            getDailyLogDirsForDeletion(source, pathStream, cutoffDate);

        log.info(
            "Found {} audit log files for deletion for service {}",
            dailyLogDirsForDeletion.size(),
            source.name());

        for (Path path : dailyLogDirsForDeletion) {
          tryToDelete(path);
        }

        log.info("Auditlog housekeeping finished");
      } catch (NoSuchFileException e) {
        log.debug("Skipping log storage directory for {} as it does not exist", source);
      } catch (IOException e) {
        throw new AuditLogHousekeepingException("Exception occurred during housekeeping", e);
      }
    }
  }

  private void tryToDelete(Path path) {
    try {
      FileSystemUtils.deleteRecursively(path);
      log.info("Successfully deleted {} ", path);
    } catch (IOException e) {
      log.error("Unable to delete %s".formatted(path), e);
    }
  }

  private List<Path> getDailyLogDirsForDeletion(
      AuditLogSource source, Stream<Path> pathStream, LocalDate cutoffDate) {
    List<Path> dailyLogDirsForDeletion = new ArrayList<>();

    for (Path path : pathStream.toList()) {
      if (!Files.isDirectory(path)) {
        log.debug("Skipping file {} as it's not a directory", path);
        continue;
      }

      final LocalDate date = getDateOrNull(path);

      if (date != null && date.isBefore(cutoffDate) && noValidAccessGranted(source, date)) {
        dailyLogDirsForDeletion.add(path);
      }
    }

    return dailyLogDirsForDeletion;
  }

  private LocalDate getDateOrNull(Path path) {
    try {
      return LocalDate.parse(path.getFileName().toString(), DateTimeFormatter.ISO_LOCAL_DATE);
    } catch (DateTimeParseException e) {
      log.debug("Not an audit log dir name %s, skipping...".formatted(path), e);
      return null;
    }
  }

  private boolean noValidAccessGranted(AuditLogSource source, LocalDate date) {
    if (grantedAccessRepository.existsByAuditLogSourceAndDateAndExpiresAtIsAfter(
        source, date, Instant.now(clock))) {
      log.debug("No valid access grant found for audit log {}/{}. Skipping...", source, date);
      return false;
    } else {
      return true;
    }
  }

  private void deleteExpiredGrants() {
    log.info("Starting housekeeping for access grants.");
    int grantsDeleted = grantedAccessRepository.deleteByIsExpired(Instant.now(clock));
    log.info("Successfully deleted {} expired access grants", grantsDeleted);
  }
}
