/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.interception;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.regex.Pattern;

public record TestHelperInterceptionRequestFilter(
    HttpMethod httpMethodFilter,
    @Schema(type = "string") Pattern urlPatternFilter,
    @Schema(type = "string") Pattern queryPatternFilter) {}
