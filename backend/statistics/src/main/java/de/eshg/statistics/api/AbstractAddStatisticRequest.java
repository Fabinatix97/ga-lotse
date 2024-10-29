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
import java.time.Instant;

@Schema(name = "AbstractAddStatisticRequest")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = AddStatisticWithDataSourcesRequest.class,
      name = AddStatisticWithDataSourcesRequest.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = AddStatisticWithTemplateRequest.class,
      name = AddStatisticWithTemplateRequest.SCHEMA_NAME),
})
public sealed interface AbstractAddStatisticRequest
    permits AddStatisticWithDataSourcesRequest, AddStatisticWithTemplateRequest {
  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();

  String name();

  Instant timeRangeStart();

  Instant timeRangeEnd();

  boolean anonymized();
}
