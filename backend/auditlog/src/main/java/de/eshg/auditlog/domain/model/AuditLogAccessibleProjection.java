/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.domain.model;

import de.eshg.auditlog.AuditLogSource;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public interface AuditLogAccessibleProjection {

  LocalDate getDate();

  AuditLogSource getAuditLogSource();

  Instant getExpiresAt();

  UUID getIdOfGrantedUser();
}
