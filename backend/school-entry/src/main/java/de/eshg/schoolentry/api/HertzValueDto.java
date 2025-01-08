/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import com.fasterxml.jackson.annotation.JsonValue;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = HertzValueDto.SCHEMA_NAME,
    description = "Sound frequency at which the hearing test is carried out.",
    example = "500")
public enum HertzValueDto {
  HZ_250("250"),
  HZ_500("500"),
  HZ_1000("1000"),
  HZ_2000("2000"),
  HZ_4000("4000"),
  HZ_6000("6000"),
  HZ_8000("8000");

  public static final String SCHEMA_NAME = "HertzValue";
  private final String value;

  HertzValueDto(String value) {
    this.value = value;
  }

  @JsonValue
  public String getValue() {
    return value;
  }
}
