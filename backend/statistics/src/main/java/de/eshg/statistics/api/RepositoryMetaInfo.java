/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record RepositoryMetaInfo(
    @NotNull long id,
    @NotNull int version,
    @NotBlank String name,
    String description,
    String changeLog,
    String contact,
    @NotBlank String createdBy,
    @NotNull Instant createdAt) {}
