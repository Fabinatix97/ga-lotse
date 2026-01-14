/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.domain.model;

import de.eshg.auditlog.AuditLogDto;
import de.eshg.auditlog.AuditLogSource;
import java.time.LocalDate;

public interface AuditLogGrantedAccessProjection {

  LocalDate getDate();

  AuditLogSource getAuditLogSource();

  int getValidGrantedAccessCount();

  default AuditLogDto getAuditLog() {
    return new AuditLogDto(getDate(), getAuditLogSource());
  }
}
