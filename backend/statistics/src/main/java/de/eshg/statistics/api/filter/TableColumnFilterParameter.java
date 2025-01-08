/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.filter;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.statistics.api.AttributeSelectionDto;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "TableColumnFilterParameter")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = BooleanFilterParameterDto.class,
      name = BooleanFilterParameterDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = NullFilterParameterDto.class,
      name = NullFilterParameterDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = TextFilterParameterDto.class,
      name = TextFilterParameterDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = DecimalRangeFilterParameterDto.class,
      name = DecimalRangeFilterParameterDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = DecimalValueFilterParameterDto.class,
      name = DecimalValueFilterParameterDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = IntegerRangeFilterParameterDto.class,
      name = IntegerRangeFilterParameterDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = IntegerValueFilterParameterDto.class,
      name = IntegerValueFilterParameterDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = ValueOptionFilterParameterDto.class,
      name = ValueOptionFilterParameterDto.SCHEMA_NAME),
})
public sealed interface TableColumnFilterParameter
    permits BooleanFilterParameterDto,
        DecimalRangeFilterParameterDto,
        DecimalValueFilterParameterDto,
        IntegerRangeFilterParameterDto,
        IntegerValueFilterParameterDto,
        NullFilterParameterDto,
        TextFilterParameterDto,
        ValueOptionFilterParameterDto {
  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();

  AttributeSelectionDto attribute();
}
