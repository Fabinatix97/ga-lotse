/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.staging;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "AdminStagedEntity")
public record StagedEntityDto<T>(
    @NotNull UUID id,
    @Valid T entity,
    @NotNull StagedEntityTypeDto stagedEntityType,
    UUID originalEntityId,
    @NotNull String author,
    @NotNull StagingStatusDto stagingStatus) {}
