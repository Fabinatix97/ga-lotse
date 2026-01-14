/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Schema(name = "AccessRestriction")
public record AccessRestrictionDto(
    @NotNull
        @Schema(
            description = "The date when the access restriction was issued.",
            example = "2024-02-03")
        LocalDate restrictionIssuedDate,
    @NotNull
        @Schema(
            description = "The date when the access restriction becomes effective.",
            example = "2024-02-10")
        LocalDate restrictionStartDate,
    @Schema(
            description = "The date when the access restriction is terminated.",
            example = "2024-02-28")
        LocalDate restrictionTerminationDate,
    @Valid List<AccessRestrictionLetterDto> letters) {}
