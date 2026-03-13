/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.api;

import de.eshg.rest.service.i18n.Language;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

@Schema(name = "MultiLangDocument")
public record MultiLangDocumentDto(
    @NotNull @Valid Map<Language, DocumentDetailsDto> localizations) {}
