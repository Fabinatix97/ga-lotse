/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.testhelper.api;

import de.eshg.officialmedicalservice.document.api.PostDocumentRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "DocumentPopulation")
public record DocumentPopulationDto(
    @NotBlank String key,
    @NotNull @Valid PostDocumentRequest request,
    String reasonForRejection,
    List<FileTestDataConfig> files,
    String note) {}
