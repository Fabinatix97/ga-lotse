/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import com.fasterxml.jackson.annotation.JsonValue;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "DecibelValue",
    description = "Decibel value that was audible for the respective ear.")
public enum DecibelValueDto {
  DB_20("20"),
  DB_30("30"),
  DB_40("40"),
  DB_50("50"),
  DB_60("60");

  final String value;

  DecibelValueDto(String value) {
    this.value = value;
  }

  @JsonValue
  public String getValue() {
    return value;
  }
}
