/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.completeness;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

@Schema(name = "CompletenessOfAttribute")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = CompletenessOfBaseAttribute.class,
      name = CompletenessOfBaseAttribute.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = CompletenessOfBusinessAttribute.class,
      name = CompletenessOfBusinessAttribute.SCHEMA_NAME)
})
public sealed interface CompletenessOfAttribute
    permits CompletenessOfBaseAttribute, CompletenessOfBusinessAttribute {
  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();

  UUID dataSourceId();

  String businessModuleName();

  boolean mandatory();

  BigDecimal percentUnknown();

  BigDecimal percentNull();

  BigDecimal percentSum();
}
