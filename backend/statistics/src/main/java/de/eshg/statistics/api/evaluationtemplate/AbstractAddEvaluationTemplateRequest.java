/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "AbstractAddEvaluationTemplateRequest")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = AddEvaluationTemplateFromEvaluationRequest.class,
      name = AddEvaluationTemplateFromEvaluationRequest.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = AddEvaluationTemplateWithDataSourcesRequest.class,
      name = AddEvaluationTemplateWithDataSourcesRequest.SCHEMA_NAME),
})
public sealed interface AbstractAddEvaluationTemplateRequest
    permits AddEvaluationTemplateFromEvaluationRequest,
        AddEvaluationTemplateWithDataSourcesRequest {
  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();

  String name();
}
