/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api;

import de.eshg.lib.statistics.api.interval.IntervalConfiguration;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record Attribute(
    @NotBlank String name,
    @NotNull String code,
    @NotNull ValueType valueType,
    String unit,
    @Size(min = 1) @Valid List<ValueOptionInternal> valueOptions,
    @NotBlank String category,
    @NotNull boolean mandatory,
    DataPrivacyCategory dataPrivacyCategory,
    @Valid IntervalConfiguration intervalConfiguration,
    Integer lDiversity,
    Double tCloseness) {}
