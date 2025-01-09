/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record AddCentralFileIdToGdprProcedureRequest(
    @Schema(
            description =
                "The Ids belonging to the Reference Data from the Central Files that shall be processed in this GDPR procedure.",
            example =
                "[be9831d4-dc25-48d8-9bfe-4c0b54bfb2c1, a37b5d6f-d72b-4e8a-b1b3-8a4c7f0e6b92]")
        @NotNull
        List<UUID> centralFileIds,
    @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        @NotNull
        long version) {}
