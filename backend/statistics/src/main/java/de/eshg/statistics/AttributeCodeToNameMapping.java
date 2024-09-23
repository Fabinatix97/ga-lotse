/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record AttributeCodeToNameMapping(
    @NotBlank String businessAttributeCode,
    @NotBlank String businessAttributeName,
    @NotNull Map<String, String> baseAttributes) {}
