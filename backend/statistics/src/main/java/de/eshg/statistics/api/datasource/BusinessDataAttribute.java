/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.datasource;

import jakarta.validation.constraints.NotBlank;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public record BusinessDataAttribute(@NotBlank String code, List<String> baseAttributeCodes) {
  public BusinessDataAttribute(String code, List<String> baseAttributeCodes) {
    this.code = code;
    this.baseAttributeCodes =
        Optional.ofNullable(baseAttributeCodes).orElse(Collections.emptyList());
  }
}
