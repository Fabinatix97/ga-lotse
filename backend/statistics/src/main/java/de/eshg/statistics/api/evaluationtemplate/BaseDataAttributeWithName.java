/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import de.eshg.lib.statistics.api.DataPrivacyCategory;
import jakarta.validation.constraints.NotBlank;

public record BaseDataAttributeWithName(
    @NotBlank String code, @NotBlank String displayName, DataPrivacyCategory dataPrivacyCategory) {}
