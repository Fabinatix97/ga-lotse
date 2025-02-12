/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.statistics.api;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import de.eshg.lib.statistics.api.ValueOptionInternal;
import de.eshg.lib.statistics.api.ValueType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record BaseAttribute(
    @NotBlank String name,
    @NotNull String code,
    @NotNull ValueType valueType,
    String unit,
    @Size(min = 1) @Valid List<ValueOptionInternal> valueOptions,
    @NotNull boolean mandatory,
    @NotNull DataPrivacyCategory dataPrivacyCategory) {}
