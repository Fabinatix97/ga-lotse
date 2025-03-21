/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.api.interval;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "IntervalConfiguration")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = DecimalIntervalBordersConfiguration.class,
      name = DecimalIntervalBordersConfiguration.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = DecimalMinMaxCountIntervalConfiguration.class,
      name = DecimalMinMaxCountIntervalConfiguration.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = IntegerIntervalBordersConfiguration.class,
      name = IntegerIntervalBordersConfiguration.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = IntegerMinMaxCountIntervalConfiguration.class,
      name = IntegerMinMaxCountIntervalConfiguration.SCHEMA_NAME),
})
public sealed interface IntervalConfiguration
    permits DecimalIntervalBordersConfiguration,
        DecimalMinMaxCountIntervalConfiguration,
        IntegerIntervalBordersConfiguration,
        IntegerMinMaxCountIntervalConfiguration {

  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();
}
