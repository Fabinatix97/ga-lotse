/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.api.commons.HasTypeDiscriminator;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InspectionSampleActor")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = InspectionSampleUserDto.class,
      name = InspectionSampleUserDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = InspectionSampleContactDto.class,
      name = InspectionSampleContactDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = InspectionSampleInspectedFacilityDto.class,
      name = InspectionSampleInspectedFacilityDto.SCHEMA_NAME)
})
public sealed interface InspectionSampleActorDto extends HasTypeDiscriminator
    permits InspectionSampleUserDto,
        InspectionSampleContactDto,
        InspectionSampleInspectedFacilityDto {}
