/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SecondaryResult")
public enum SecondaryResultDto {
  S,
  I,
  D,
  F,
  M,
  X,
  Z,
  T,
  H,
  O,
  V,
  N,
  U,
  K,
  E,
  W,
  P,
  A,

  DA,
  FA,
  ID,
  INS,
  @JsonProperty("LÜ")
  LUE,
  RET,
  ZA
}
