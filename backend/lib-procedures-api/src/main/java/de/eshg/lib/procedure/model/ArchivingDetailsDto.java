/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "ArchivingDetails")
public record ArchivingDetailsDto(
    @NotNull ArchivingRelevanceDto archivingRelevance, @NotNull int archivingPeriodYears) {}
