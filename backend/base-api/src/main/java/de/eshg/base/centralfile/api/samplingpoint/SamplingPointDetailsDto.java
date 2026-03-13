/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.samplingpoint;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

@Schema(
    name = SamplingPointDetailsDto.SCHEMA_NAME,
    description = "The data relating to a sampling point")
public record SamplingPointDetailsDto(
    UUID facilityId, @NotNull @Size(min = 1, max = MAX_NAME_LENGTH) String name, String zid)
    implements SamplingPointDetails {

  public static final int MAX_NAME_LENGTH = 300;
  public static final String SCHEMA_NAME = "SamplingPointDetails";
}
