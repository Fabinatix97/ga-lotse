/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "MonetaryFine")
public record MonetaryFineDto(
    @NotNull @Schema(description = "The unique identifier for the monetary fine.") UUID externalId,
    @NotNull @Schema(description = "The date when the monetary fine was issued.")
        LocalDate fineIssuedDate) {}
