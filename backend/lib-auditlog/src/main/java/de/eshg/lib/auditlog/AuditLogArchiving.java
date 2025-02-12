/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import de.eshg.auditlog.AddAuditLogFileRequest;
import de.eshg.auditlog.AuditLogArchivingApi;
import de.eshg.auditlog.AuditLogSource;
import de.eshg.lib.auditlog.domain.AuditLogEntry;
import de.eshg.lib.auditlog.domain.AuditLogEntryRepository;
import de.eshg.lib.rest.oauth.client.commons.ModuleClientAuthenticator;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import jakarta.transaction.Transactional;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException.BadRequest;

@Component
public class AuditLogArchiving {

  private static final org.slf4j.Logger log =
      org.slf4j.LoggerFactory.getLogger(AuditLogArchiving.class);

  private final AuditLogArchivingApi auditLogArchivingApi;
  private final AuditLogSource auditLogSource;
  private final ModuleClientAuthenticator moduleClientAuthenticator;
  private final AuditLogEntryRepository auditLogEntryRepository;
  private final Clock clock;

  public AuditLogArchiving(
      AuditLogArchivingApi auditLogArchivingApi,
      AuditLogSource auditLogSource,
      ModuleClientAuthenticator moduleClientAuthenticator,
      AuditLogEntryRepository auditLogEntryRepository,
      Clock clock) {
    this.auditLogArchivingApi = auditLogArchivingApi;
    this.auditLogSource = auditLogSource;
    this.moduleClientAuthenticator = moduleClientAuthenticator;
    this.auditLogEntryRepository = auditLogEntryRepository;
    this.clock = clock;
  }

  @Scheduled(cron = "${de.eshg.auditlog.archiving.schedule:@daily}")
  @Transactional
  public void runArchivingJob() {
    moduleClientAuthenticator.doWithModuleClientAuthentication(this::archiveOldAuditlogFiles);
  }

  private void archiveOldAuditlogFiles() {
    log.info("Starting archiving of old audit log entries");

    Instant todayAtStartOfDay = LocalDate.now(clock).atStartOfDay(clock.getZone()).toInstant();
    List<AuditLogEntry> toArchive =
        auditLogEntryRepository.findByCreatedAtBeforeOrderByCreatedAtAscIdAsc(todayAtStartOfDay);

    log.info("Found {} entries created before {}", toArchive.size(), todayAtStartOfDay);

    Map<LocalDate, List<AuditLogEntry>> auditLogEntriesByDate =
        toArchive.stream()
            .collect(
                Collectors.groupingBy(
                    auditLogEntry ->
                        LocalDate.ofInstant(auditLogEntry.getCreatedAt(), clock.getZone()),
                    LinkedHashMap::new,
                    Collectors.toList()));

    for (LocalDate auditLogDate : auditLogEntriesByDate.keySet()) {
      try {
        List<AuditLogEntry> auditLogEntries = auditLogEntriesByDate.get(auditLogDate);
        log.info("Found {} entries to be archived for {}", auditLogEntries.size(), auditLogDate);

        archiveAuditLog(auditLogDate, auditLogEntries);
      } catch (Exception e) {
        log.error("Error while trying to archive audit log for {}.", auditLogDate, e);
      }
    }

    log.info("Finished archiving of old audit logs");
  }

  private void archiveAuditLog(LocalDate auditLogDate, List<AuditLogEntry> auditLogEntries) {
    String content =
        auditLogEntries.stream().map(AuditLogFormatter::format).collect(Collectors.joining("\n"));

    AuditLogFile auditLogFile =
        new AuditLogFile(auditLogDate.toString(), content.getBytes(StandardCharsets.UTF_8));

    try {
      auditLogArchivingApi.addAuditlogFile(
          new AddAuditLogFileRequest(auditLogDate, auditLogSource), auditLogFile);
      log.info("Archived audit logs for {}", auditLogDate);

      deleteAuditLog(auditLogDate, auditLogEntries);
    } catch (BadRequest exception) {
      if (isAlreadyExistsError(exception)) {
        log.error(
            "Audit log for {} already exists. Performing cleanup...", auditLogDate, exception);
        deleteAuditLog(auditLogDate, auditLogEntries);
      } else {
        throw exception;
      }
    }
  }

  private boolean isAlreadyExistsError(BadRequest exception) {
    try {
      ErrorResponse errorResponse = exception.getResponseBodyAs(ErrorResponse.class);
      if (errorResponse != null) {
        return ErrorCode.ALREADY_EXISTS.equals(errorResponse.errorCode());
      }
    } catch (Exception e) {
      return false;
    }

    return false;
  }

  private void deleteAuditLog(LocalDate auditLogDate, List<AuditLogEntry> auditLogEntries) {
    auditLogEntryRepository.deleteAll(auditLogEntries);
    log.info("Deleted {} local audit entries for {}", auditLogEntries.size(), auditLogDate);
  }
}
