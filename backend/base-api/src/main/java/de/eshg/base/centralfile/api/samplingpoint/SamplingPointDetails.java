/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.samplingpoint;

import io.swagger.v3.oas.annotations.media.Schema;

public interface SamplingPointDetails {
  @Schema(description = "The name of the Sampling Point.", example = "Example Sampling Point")
  String name();

  @Schema(
      description = "Unique identifier of the Sampling Point, defined by TEIS3 spec.",
      example = "010212345678901234567")
  String zid();
}
