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

@Schema(name = "AbstractUpdateEvaluationRequest")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = UpdateEvaluationNameRequest.class,
      name = UpdateEvaluationNameRequest.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = UpdateEvaluationTimeRangeRequest.class,
      name = UpdateEvaluationTimeRangeRequest.SCHEMA_NAME),
})
public sealed interface AbstractUpdateEvaluationRequest
    permits UpdateEvaluationNameRequest, UpdateEvaluationTimeRangeRequest {

  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();
}
