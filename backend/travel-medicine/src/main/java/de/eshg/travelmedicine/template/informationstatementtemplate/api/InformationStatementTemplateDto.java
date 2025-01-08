/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.template.informationstatementtemplate.api;

import de.eshg.travelmedicine.disease.api.DiseaseDto;
import de.eshg.travelmedicine.template.api.TemplateContentDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "InformationStatementTemplate")
public record InformationStatementTemplateDto(
    @NotNull UUID id,
    @NotNull @Size(max = 200) String name,
    @NotNull @Size(max = 200) String title,
    @NotNull InformationStatementTemplateStateDto state,
    @NotNull Instant createdAt,
    Instant modifiedAt,
    @NotNull @Valid List<DiseaseDto> diseases,
    @NotNull @Valid TemplateContentDto content) {}
