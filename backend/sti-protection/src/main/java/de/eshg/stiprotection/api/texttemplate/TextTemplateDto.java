/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.texttemplate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "TextTemplate")
public record TextTemplateDto(
    @NotNull UUID externalId,
    @NotBlank String name,
    @NotNull TextTemplateContextDto context,
    @NotBlank String content) {}
