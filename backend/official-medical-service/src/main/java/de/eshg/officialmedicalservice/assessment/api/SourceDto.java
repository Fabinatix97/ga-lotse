/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.assessment.api;

import de.eshg.lib.assessment.domain.model.Source;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

/**
 * @see Source
 */
@Schema(name = "OmsSource")
public record SourceDto(@NotNull String title, @NotNull String author, @NotNull String link) {}
