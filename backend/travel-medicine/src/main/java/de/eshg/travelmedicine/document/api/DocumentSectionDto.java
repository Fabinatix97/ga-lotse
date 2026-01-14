/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(name = "DocumentSection")
public record DocumentSectionDto(
    @Size(max = 200) String sectionTitle,
    @NotNull @Valid @Size(min = 1) List<DocumentSectionElementDto> sectionElements) {}
