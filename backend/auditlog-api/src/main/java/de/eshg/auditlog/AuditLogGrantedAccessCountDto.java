/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "AuditLogGrantedAccessCount")
public record AuditLogGrantedAccessCountDto(
    @NotNull @Valid AuditLogDto auditLog,
    @NotNull @Schema(description = "Number of users having granted access")
        int validGrantedAccessCount) {}
