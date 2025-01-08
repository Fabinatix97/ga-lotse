/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.interception;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.regex.Pattern;

public record InsertRequestInterceptionTestHelperRequest(
    @NotNull InterceptionType type, @Valid TestHelperInterceptionRequestFilter filter) {
  public InsertRequestInterceptionTestHelperRequest(
      InterceptionType type,
      HttpMethod httpMethod,
      Pattern urlPatternFilter,
      Pattern queryPatternFilter) {
    this(
        type,
        new TestHelperInterceptionRequestFilter(httpMethod, urlPatternFilter, queryPatternFilter));
  }
}
