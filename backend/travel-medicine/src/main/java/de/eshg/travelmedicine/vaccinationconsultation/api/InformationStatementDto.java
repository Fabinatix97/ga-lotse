/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "InformationStatement")
public record InformationStatementDto(
    @NotNull UUID id,
    @NotNull @Size(max = 200) String title,
    @NotNull @Size(max = 4000) String content,
    @NotNull boolean citizenHasAnswered,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt) {}
