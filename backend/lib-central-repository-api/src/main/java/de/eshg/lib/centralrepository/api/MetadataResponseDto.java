/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.centralrepository.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;

@Schema(name = "MetadataResponse")
@JsonInclude(Include.NON_NULL)
public record MetadataResponseDto(
    @NotNull long id,
    @NotNull int version,
    @NotBlank String moduleName,
    @NotBlank String objectName,
    @NotBlank String category,
    @NotBlank String name,
    @NotNull List<String> tags,
    String description,
    String changeLog,
    String contact,
    @NotBlank String createdBy,
    @NotNull Instant createdAt,
    String deletedBy,
    Instant deletedAt,
    @NotNull String contentType) {}
