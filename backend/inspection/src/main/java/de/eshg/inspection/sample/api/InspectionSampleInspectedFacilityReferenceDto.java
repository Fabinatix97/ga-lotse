/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = InspectionSampleInspectedFacilityReferenceDto.SCHEMA_NAME)
public record InspectionSampleInspectedFacilityReferenceDto()
    implements InspectionSampleActorReferenceDto {
  public static final String SCHEMA_NAME = "InspectionSampleInspectedFacilityReference";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
