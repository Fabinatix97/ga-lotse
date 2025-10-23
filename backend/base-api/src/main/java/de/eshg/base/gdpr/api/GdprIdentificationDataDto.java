/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.api.commons.HasTypeDiscriminator;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "GdprIdentificationData")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(value = GdprPersonDto.class, name = GdprPersonDto.SCHEMA_NAME),
  @JsonSubTypes.Type(value = GdprFacilityDto.class, name = GdprFacilityDto.SCHEMA_NAME)
})
public sealed interface GdprIdentificationDataDto extends HasTypeDiscriminator
    permits GdprFacilityDto, GdprPersonDto {}
