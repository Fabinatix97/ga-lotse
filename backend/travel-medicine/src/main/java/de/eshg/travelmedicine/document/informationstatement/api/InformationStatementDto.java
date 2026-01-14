/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.informationstatement.api;

import de.eshg.travelmedicine.document.api.DocumentContentDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "InformationStatement")
public record InformationStatementDto(
    @NotNull UUID id,
    @NotNull @Size(max = 200) String title,
    @NotNull @Valid DocumentContentDto content,
    @NotNull boolean citizenHasAnswered,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt) {}
