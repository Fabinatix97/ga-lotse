/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.datasource;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record BusinessDataSourceAttribute(
    @NotBlank String name,
    @NotBlank String code,
    @NotBlank String category,
    DataPrivacyCategory dataPrivacyCategory,
    @Valid List<BaseDataSourceAttribute> baseAttributes) {}
