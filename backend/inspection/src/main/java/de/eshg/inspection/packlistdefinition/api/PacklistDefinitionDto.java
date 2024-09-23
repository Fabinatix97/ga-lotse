/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.packlistdefinition.api;

import de.eshg.inspection.objecttype.api.ObjectTypeRefDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(name = "PacklistDefinition")
public record PacklistDefinitionDto(
    @NotNull UUID id,
    @NotNull String name,
    @NotNull UUID mostRecentRevisionId,
    @NotNull int mostRecentRevisionNr,
    @Valid ObjectTypeRefDto objectType,
    @Valid @NotNull List<PacklistDefinitionRevisionDto> revisions,
    @NotNull long version) {}
