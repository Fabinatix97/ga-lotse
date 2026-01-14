/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

@Schema(name = "AccessibleAuditLog")
public record AccessibleAuditLogDto(
    @NotNull @Valid AuditLogDto auditLog, @NotNull Instant expiresAt) {}
