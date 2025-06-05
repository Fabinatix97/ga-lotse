/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config.api;

import de.eshg.config.api.MultiLangDocumentDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "CitizenAndEmployeeMarkdownInfo")
public record CitizenAndEmployeeMarkdownInfoDto(
    @NotNull @Valid MultiLangDocumentDto citizen, @NotNull @Valid MultiLangDocumentDto employee) {}
