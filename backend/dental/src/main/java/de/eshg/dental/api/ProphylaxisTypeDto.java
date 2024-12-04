/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ProphylaxisType", description = "Type of the prophylaxis")
public enum ProphylaxisTypeDto {
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7
}
