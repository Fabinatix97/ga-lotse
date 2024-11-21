/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.centralrepository.dto.filter;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.constraints.NotNull;

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(value = RepoBooleanFilter.class, name = RepoBooleanFilter.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = RepoDecimalRangeFilter.class,
      name = RepoDecimalRangeFilter.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = RepoDecimalValueFilter.class,
      name = RepoDecimalValueFilter.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = RepoIntegerRangeFilter.class,
      name = RepoIntegerRangeFilter.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = RepoIntegerValueFilter.class,
      name = RepoIntegerValueFilter.SCHEMA_NAME),
  @JsonSubTypes.Type(value = RepoNullFilter.class, name = RepoNullFilter.SCHEMA_NAME),
  @JsonSubTypes.Type(value = RepoTextFilter.class, name = RepoTextFilter.SCHEMA_NAME),
  @JsonSubTypes.Type(value = RepoValueOptionFilter.class, name = RepoValueOptionFilter.SCHEMA_NAME),
})
public sealed interface RepoFilter
    permits RepoBooleanFilter,
        RepoDecimalRangeFilter,
        RepoDecimalValueFilter,
        RepoIntegerRangeFilter,
        RepoIntegerValueFilter,
        RepoNullFilter,
        RepoTextFilter,
        RepoValueOptionFilter {
  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();
}
