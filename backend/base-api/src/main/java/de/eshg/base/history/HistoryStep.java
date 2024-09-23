/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.history;

import de.eshg.base.user.api.UserDto;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record HistoryStep<T>(
    @Schema(description = "The old object revision before the change.", title = "HEllO!") @Valid
        T before,
    @Schema(description = "The new object revision after the change.") @Valid T after,
    @NotNull HistoryEntryType type,
    @Schema(
            description = "The Id of the User who modified the object.",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID modifiedBy,
    @Valid UserDto resolvedUser,
    @Schema(
            description = "The date and time of when the object was modified.",
            example = "2024-02-01T00:00:00.123456Z")
        @NotNull
        Instant modifiedAt,
    @ArraySchema(
            arraySchema =
                @Schema(
                    description = "A list of fields that has been changed in this revision step."))
        @NotNull
        List<String> changedFields) {}
