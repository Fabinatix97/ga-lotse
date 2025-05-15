/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.api;

import de.eshg.config.api.MultiLangDocumentDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.URL;

@Schema(name = "OpenDataConfig")
public record OpenDataConfigDto(
    @NotNull String author,
    @Valid @NotNull MultiLangDocumentDto termsOfUse,
    @NotNull @URL String licenseUrl) {}
