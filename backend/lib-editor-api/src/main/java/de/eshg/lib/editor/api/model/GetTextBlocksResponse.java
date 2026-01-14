/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.api.model;

import de.eshg.api.commons.PagedResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "GetTextBlocksResponse")
public record GetTextBlocksResponse(
    @NotNull @Valid List<TextBlockDto> elements, @NotNull @Min(0) long totalNumberOfElements)
    implements PagedResponse<TextBlockDto> {}
