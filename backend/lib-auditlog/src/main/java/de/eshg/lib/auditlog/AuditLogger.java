/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import de.eshg.lib.auditlog.config.AuditLogConfig;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public final class AuditLogger {

  private static final String MESSAGE_TEMPLATE =
      """
      Zeitstempel: %s
      Kategorie: %s
      Funktion: %s
      Zusätzliche Attribute: %s
      """;

  private final Path outputDirPath;
  private final Clock clock;
  private final UuidProvider uuidProvider;

  AuditLogger(AuditLogConfig auditLogConfig, Clock clock, UuidProvider uuidProvider) {
    this.outputDirPath = auditLogConfig.getLogOutputDir();
    this.clock = clock;
    this.uuidProvider = uuidProvider;
  }

  public void log(String category, String function, Map<String, String> additionalData) {
    String formattedAdditionalData =
        additionalData.entrySet().stream()
            .sorted(Entry.comparingByKey())
            .map(e -> "\t- %s: %s".formatted(e.getKey(), e.getValue()))
            .collect(Collectors.joining(System.lineSeparator(), System.lineSeparator(), ""));

    final Instant now = clock.instant();

    String message =
        MESSAGE_TEMPLATE.formatted(
            now,
            category,
            function,
            !formattedAdditionalData.isBlank() ? formattedAdditionalData : "-");

    try {
      Files.writeString(
          getLogFilePath(now),
          message + System.lineSeparator(),
          StandardCharsets.UTF_8,
          StandardOpenOption.CREATE,
          StandardOpenOption.APPEND);
    } catch (IOException e) {
      throw new AuditLoggerException("Exception occurred while trying to write to audit log", e);
    }
  }

  private Path getLogFilePath(Instant now) throws IOException {
    final Path auditLogDateBasedDirectory =
        outputDirPath.resolve(AuditLogHelper.getAuditLogFileName(LocalDate.now(clock)));
    Files.createDirectories(auditLogDateBasedDirectory); // create directory if it does not exist
    return auditLogDateBasedDirectory.resolve(
        String.format(
            "%012d%09d-%s", now.getEpochSecond(), now.getNano(), uuidProvider.nextUuid()));
  }
}
