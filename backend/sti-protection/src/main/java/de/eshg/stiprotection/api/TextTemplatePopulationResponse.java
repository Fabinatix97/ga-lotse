/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.stiprotection.api.texttemplate.TextTemplateDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record TextTemplatePopulationResponse(
    @Valid List<TextTemplateDto> textTemplates, @NotNull long count) {}
