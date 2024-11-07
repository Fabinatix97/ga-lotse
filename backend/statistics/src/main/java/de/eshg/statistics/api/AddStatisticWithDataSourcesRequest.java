/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api;

import static de.eshg.statistics.api.AddStatisticWithDataSourcesRequest.SCHEMA_NAME;

import de.eshg.statistics.api.datasource.DataSourceDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

@Schema(name = SCHEMA_NAME)
public record AddStatisticWithDataSourcesRequest(
    @NotBlank String name,
    @NotNull Instant timeRangeStart,
    @NotNull Instant timeRangeEnd,
    @Size(min = 1, max = 1) @NotNull @Valid List<DataSourceDto> dataSources,
    @NotNull boolean anonymized,
    String templateName)
    implements AbstractAddStatisticRequest {
  public static final String SCHEMA_NAME = "AddStatisticWithDataSourcesRequest";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
