/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import de.eshg.api.commons.CanBeLogged;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "ArchivingRelevanceSettings")
public record ArchivingRelevanceSettingsDto(
    @CanBeLogged @NotNull ArchivingRelevanceDto archivingRelevance,
    @CanBeLogged @NotNull ArchivingRelevanceDto defaultArchivingRelevance) {}
