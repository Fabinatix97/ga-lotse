/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.document.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = "DocumentSubElementMultiSelect")
public record DocumentSubElementMultiSelectDto(
    @NotNull @Size(max = 200) String questionText, Boolean answer) {}
