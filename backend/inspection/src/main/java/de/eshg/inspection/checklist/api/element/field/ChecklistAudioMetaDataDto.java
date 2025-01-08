/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api.element.field;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "CLAudioMetaData")
public record ChecklistAudioMetaDataDto(
    @NotNull UUID audioID,
    @NotNull String fileName,
    @NotNull long fileSize,
    @NotNull Instant fileDate) {}
