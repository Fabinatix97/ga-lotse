/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "ArchivingRelevanceSettings")
public record ArchivingRelevanceSettingsDto(
    @NotNull ArchivingRelevanceDto archivingRelevance,
    @NotNull ArchivingRelevanceDto defaultArchivingRelevance) {}
