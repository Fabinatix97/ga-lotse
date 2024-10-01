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

@Schema(name = "AbstractUpdateReportSeriesRequest")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = ActivateAutoReportSeriesRequest.class,
      name = ActivateAutoReportSeriesRequest.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = DeactivateAutoReportSeriesRequest.class,
      name = DeactivateAutoReportSeriesRequest.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = UpdateNameAndDescriptionReportSeriesRequest.class,
      name = UpdateNameAndDescriptionReportSeriesRequest.SCHEMA_NAME),
})
public sealed interface AbstractUpdateReportSeriesRequest
    permits ActivateAutoReportSeriesRequest,
        DeactivateAutoReportSeriesRequest,
        UpdateNameAndDescriptionReportSeriesRequest {
  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();
}
