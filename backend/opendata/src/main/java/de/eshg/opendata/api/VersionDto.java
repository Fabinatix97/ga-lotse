/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.api;

import de.eshg.lib.common.BusinessModule;
import de.eshg.opendata.domain.model.OpenDataFileType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Schema(name = "Version")
public record VersionDto(
    @NotEmpty String versionName,
    @NotNull
        @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        long version,
    @NotNull UUID externalId,
    @NotNull int major,
    @NotNull int minor,
    @NotNull Instant publicationDate,
    LocalDate statisticStartDate,
    LocalDate statisticEndDate,
    @NotNull Set<BusinessModule> sources,
    String author,
    String description,
    @NotNull OpenDataFileType fileType,
    @NotNull String fileName,
    @NotNull int fileSize,
    @NotEmpty String licence) {}
