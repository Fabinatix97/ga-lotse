/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.citizenpublic.api;

import de.eshg.officialmedicalservice.procedure.api.ConcernCategoryConfigDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "GetCitizenConcernsResponse")
public record GetCitizenConcernsResponse(
    @NotNull @Valid List<ConcernCategoryConfigDto> categories, String infobox) {}
