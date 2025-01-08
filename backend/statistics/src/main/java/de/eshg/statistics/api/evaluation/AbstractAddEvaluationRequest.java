/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluation;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

@Schema(name = "AbstractAddEvaluationRequest")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = AddEvaluationWithDataSourcesRequest.class,
      name = AddEvaluationWithDataSourcesRequest.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = AddEvaluationWithTemplateRequest.class,
      name = AddEvaluationWithTemplateRequest.SCHEMA_NAME),
})
public sealed interface AbstractAddEvaluationRequest
    permits AddEvaluationWithDataSourcesRequest, AddEvaluationWithTemplateRequest {
  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();

  String name();

  Instant timeRangeStart();

  Instant timeRangeEnd();

  boolean anonymized();
}
