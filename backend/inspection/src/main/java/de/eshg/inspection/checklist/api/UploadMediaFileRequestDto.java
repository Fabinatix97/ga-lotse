/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.checklist.api;

import de.eshg.inspection.checklist.api.update.element.UpdateChecklistElementDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "UploadMediaFileRequest")
public record UploadMediaFileRequestDto(
    @NotNull UUID inspectionExternalId,
    @NotNull UUID checklistId,
    @Valid @NotNull UpdateChecklistElementDto updateElementDto,
    @NotNull UUID fileExternalId) {}
