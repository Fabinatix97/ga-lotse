/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record GetMedicalRegistryEntries(
    @NotNull @Schema(description = "Total number of result pages for the given filter criteria")
        int totalPages,
    @NotNull @Schema(description = "Total number of result elements for the given filter criteria")
        long totalElements,
    @Valid @NotNull @Size(max = 200) List<MedicalRegistryEntryDto> medicalRegistryEntries) {}
