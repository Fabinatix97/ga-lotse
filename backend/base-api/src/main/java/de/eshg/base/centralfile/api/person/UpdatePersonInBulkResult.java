/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UpdatePersonInBulkResult(
    @Schema(
            description =
                "The id of a person file state for which the update operation was successful",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID previousFileStateId,
    @Schema(
            description =
                "The id of the corresponding file state which was created during the update operation and contains the new data",
            example = "df384786-9f85-4404-a9fd-33391da2d2b4")
        @NotNull
        UUID newFileStateId) {}
