/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record GetInboxProceduresResponse(
    @NotNull @Schema(description = "Total number of result pages for the given filter criteria")
        int totalPages,
    @NotNull @Schema(description = "Total number of result elements for the given filter criteria")
        long totalElements,
    @Valid @NotNull @Size(max = 200) List<InboxProcedureDto> inboxProcedures) {}
