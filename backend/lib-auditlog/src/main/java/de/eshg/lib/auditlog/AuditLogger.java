/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog;

import de.eshg.lib.auditlog.domain.AuditLogEntry;
import de.eshg.lib.auditlog.domain.AuditLogEntryRepository;
import java.util.Map;
import java.util.TreeMap;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AuditLogger {

  private final AuditLogEntryRepository auditLogEntryRepository;

  AuditLogger(AuditLogEntryRepository auditLogEntryRepository) {
    this.auditLogEntryRepository = auditLogEntryRepository;
  }

  @Transactional
  public void log(String category, String function, Map<String, String> additionalData) {
    AuditLogEntry auditLogEntry = new AuditLogEntry();
    auditLogEntry.setCategory(category);
    auditLogEntry.setFunction(function);
    auditLogEntry.setAdditionalData(new TreeMap<>(additionalData));
    auditLogEntryRepository.save(auditLogEntry);
  }
}
