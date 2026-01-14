/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.datasource;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BaseDataSourceAttribute(
    @NotBlank String displayName,
    @NotBlank String name,
    @NotBlank String code,
    @NotNull DataPrivacyCategory dataPrivacyCategory) {}
