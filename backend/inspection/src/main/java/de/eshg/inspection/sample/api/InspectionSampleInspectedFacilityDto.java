/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.sample.api;

import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = InspectionSampleInspectedFacilityDto.SCHEMA_NAME)
public record InspectionSampleInspectedFacilityDto(
    @NotNull @Valid GetFacilityFileStateResponse facilityFileState)
    implements InspectionSampleActorDto {
  public static final String SCHEMA_NAME = "InspectionSampleInspectedFacility";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
