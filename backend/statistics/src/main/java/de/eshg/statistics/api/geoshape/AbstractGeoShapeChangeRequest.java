/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.geoshape;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "AbstractGeoShapeChangeRequest")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = GeoShapeChangeStatusRequest.class,
      name = GeoShapeChangeStatusRequest.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = GeoShapeChangeTitleRequest.class,
      name = GeoShapeChangeTitleRequest.SCHEMA_NAME),
})
public sealed interface AbstractGeoShapeChangeRequest
    permits GeoShapeChangeStatusRequest, GeoShapeChangeTitleRequest {
  @Hidden
  @NotNull
  @JsonProperty("@type")
  String type();
}
