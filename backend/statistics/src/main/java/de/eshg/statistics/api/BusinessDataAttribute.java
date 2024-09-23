/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import jakarta.validation.constraints.NotNull;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public record BusinessDataAttribute(@NotNull String code, List<String> baseAttributeCodes) {
  public BusinessDataAttribute(String code, List<String> baseAttributeCodes) {
    this.code = code;
    this.baseAttributeCodes =
        Optional.ofNullable(baseAttributeCodes).orElse(Collections.emptyList());
  }
}
