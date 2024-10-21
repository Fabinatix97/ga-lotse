/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluationtemplate;

import static de.eshg.statistics.api.evaluationtemplate.AddEvaluationTemplateWithDataSourcesRequest.SCHEMA_NAME;

import de.eshg.statistics.api.DataSourceDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(name = SCHEMA_NAME)
public record AddEvaluationTemplateWithDataSourcesRequest(
    @NotBlank String name, @NotNull @Size(min = 1, max = 1) @Valid List<DataSourceDto> dataSources)
    implements AbstractAddEvaluationTemplateRequest {
  public static final String SCHEMA_NAME = "AddEvaluationTemplateWithDataSourcesRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
