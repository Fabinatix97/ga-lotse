/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import de.eshg.base.contact.api.InstitutionContactCategoryDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "Institution")
public record InstitutionDto(
    @NotNull UUID id, @NotNull String name, @NotNull InstitutionContactCategoryDto category) {}
