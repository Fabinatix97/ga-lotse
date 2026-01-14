/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.api.commons.HasTypeDiscriminator;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InspectionSampleActorReference")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = InspectionSampleUserReferenceDto.class,
      name = InspectionSampleUserReferenceDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = InspectionSampleContactReferenceDto.class,
      name = InspectionSampleContactReferenceDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = InspectionSampleInspectedFacilityReferenceDto.class,
      name = InspectionSampleInspectedFacilityReferenceDto.SCHEMA_NAME)
})
public sealed interface InspectionSampleActorReferenceDto extends HasTypeDiscriminator
    permits InspectionSampleUserReferenceDto,
        InspectionSampleContactReferenceDto,
        InspectionSampleInspectedFacilityReferenceDto {}
