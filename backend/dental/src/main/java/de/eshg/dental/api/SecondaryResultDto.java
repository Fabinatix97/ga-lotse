/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SecondaryResult")
public enum SecondaryResultDto {
  DA,
  FA,
  FIS,
  ID,
  INS,
  @JsonProperty("LÜ")
  LUE,
  RET,
  TR,
  WR,
  ZA
}
