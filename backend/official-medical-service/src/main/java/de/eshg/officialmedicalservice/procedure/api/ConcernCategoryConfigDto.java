/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.api;

import de.eshg.rest.service.i18n.Language;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

@Schema(name = "ConcernCategoryConfig")
public record ConcernCategoryConfigDto(
    @NotNull @Valid Map<Language, String> names, @NotNull @Valid List<ConcernConfigDto> concerns) {}
