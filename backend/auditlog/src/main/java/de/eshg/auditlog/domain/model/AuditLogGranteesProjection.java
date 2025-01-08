/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.domain.model;

import java.time.Instant;
import java.util.UUID;

public interface AuditLogGranteesProjection {
  UUID getIdOfGrantedUser();

  Instant getExpiresAt();
}
