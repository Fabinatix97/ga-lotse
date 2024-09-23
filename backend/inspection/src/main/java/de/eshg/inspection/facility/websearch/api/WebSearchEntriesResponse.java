/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.base.PagedResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "WebSearchEntriesResponse")
public record WebSearchEntriesResponse(
    @NotNull int totalPages,
    @NotNull long totalElements,
    @NotNull @Valid List<WebSearchEntryDto> entries)
    implements PagedResponse<WebSearchEntryDto> {
  @JsonIgnore
  @Override
  public List<WebSearchEntryDto> elements() {
    return entries;
  }

  @JsonIgnore
  @Override
  public long totalNumberOfElements() {
    return totalElements;
  }
}
