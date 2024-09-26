/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetAvailableAuditLogsResponse(
    @NotNull @Schema(description = "Total number of result pages") int totalPages,
    @NotNull @Schema(description = "Total number of result elements") long totalElements,
    @NotNull @Valid List<AuditLogGrantedAccessCountDto> logs) {}
