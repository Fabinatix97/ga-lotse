/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "AbstractUpdateStatisticRequest")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = UpdateStatisticNameRequest.class,
      name = UpdateStatisticNameRequest.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = UpdateStatisticTimeRangeRequest.class,
      name = UpdateStatisticTimeRangeRequest.SCHEMA_NAME),
})
public sealed interface AbstractUpdateStatisticRequest
    permits UpdateStatisticNameRequest, UpdateStatisticTimeRangeRequest {

  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();
}
