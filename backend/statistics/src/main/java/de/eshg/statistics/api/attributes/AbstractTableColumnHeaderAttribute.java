/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.attributes;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "AbstractTableColumnHeaderAttribute")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(value = BooleanAttribute.class, name = BooleanAttribute.SCHEMA_NAME),
  @JsonSubTypes.Type(value = BaseModuleIdAttribute.class, name = BaseModuleIdAttribute.SCHEMA_NAME),
  @JsonSubTypes.Type(value = DateAttribute.class, name = DateAttribute.SCHEMA_NAME),
  @JsonSubTypes.Type(value = DecimalAttribute.class, name = DecimalAttribute.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = DecimalIntervalAttribute.class,
      name = DecimalIntervalAttribute.SCHEMA_NAME),
  @JsonSubTypes.Type(value = IntegerAttribute.class, name = IntegerAttribute.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = IntegerIntervalAttribute.class,
      name = IntegerIntervalAttribute.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = ProcedureReferenceAttribute.class,
      name = ProcedureReferenceAttribute.SCHEMA_NAME),
  @JsonSubTypes.Type(value = TextAttribute.class, name = TextAttribute.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = ValueWithOptionsAttribute.class,
      name = ValueWithOptionsAttribute.SCHEMA_NAME),
})
public sealed interface AbstractTableColumnHeaderAttribute
    permits BooleanAttribute,
        BaseModuleIdAttribute,
        DateAttribute,
        DecimalAttribute,
        DecimalIntervalAttribute,
        IntegerAttribute,
        IntegerIntervalAttribute,
        ProcedureReferenceAttribute,
        TextAttribute,
        ValueWithOptionsAttribute {
  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();

  String name();

  String code();
}
