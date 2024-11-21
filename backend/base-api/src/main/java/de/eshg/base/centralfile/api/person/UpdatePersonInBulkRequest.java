/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UpdatePersonInBulkRequest(
    @Schema(
            description = "Id of the person file state which shall be updated.",
            example = "be9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID fileStateId,
    @NotNull @Valid PersonDetailsDto updatedPerson) {}
