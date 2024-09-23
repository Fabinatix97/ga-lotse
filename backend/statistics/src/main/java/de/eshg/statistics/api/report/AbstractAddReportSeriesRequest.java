/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.report;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "AbstractAddReportSeriesRequest")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = AddAutoReportSeriesRequest.class,
      name = AddAutoReportSeriesRequest.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = AddManualReportSeriesRequest.class,
      name = AddManualReportSeriesRequest.SCHEMA_NAME),
})
public sealed interface AbstractAddReportSeriesRequest
    permits AddAutoReportSeriesRequest, AddManualReportSeriesRequest {
  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();

  UUID statisticId();

  String name();

  String description();
}
