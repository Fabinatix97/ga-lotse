/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import de.eshg.lib.auditlog.domain.AuditLogEntry;
import java.util.stream.Collectors;

public final class AuditLogFormatter {

  private AuditLogFormatter() {}

  private static final String TEMPLATE =
      """
      Zeitstempel: %s
      Kategorie: %s
      Funktion: %s
      Zusätzliche Attribute: %s
      """;

  public static String format(AuditLogEntry auditLogEntry) {
    String formattedAdditionalData =
        auditLogEntry.getAdditionalData().entrySet().stream()
            .map(e -> "\t- %s: %s".formatted(e.getKey(), e.getValue()))
            .collect(Collectors.joining(System.lineSeparator(), System.lineSeparator(), ""));

    return TEMPLATE.formatted(
        auditLogEntry.getCreatedAt(),
        auditLogEntry.getCategory(),
        auditLogEntry.getFunction(),
        !formattedAdditionalData.isBlank() ? formattedAdditionalData : "-");
  }
}
