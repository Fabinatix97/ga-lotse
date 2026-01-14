/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.file.api;

import de.eshg.lib.procedure.model.FileTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "OmsFile")
public record OmsFileDto(
    @NotNull UUID id,
    @NotNull String name,
    @NotNull FileTypeDto fileType,
    @NotNull int size,
    @NotNull Instant creationDate) {}
