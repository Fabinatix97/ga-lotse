/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.samplingpoint;

import de.eshg.base.centralfile.api.DataOriginDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

@Schema(description = "Request used for adding sampling points from non-external sources")
public record AddSamplingPointFileStateRequest(
    @Schema(
            description =
                "Id of a referenceSamplingPoint. If this Id is provided, a new File State with the input attributes is created for that referenceSamplingPoint, regardless of any matching logic.",
            example = "be9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        UUID referenceSamplingPointId,
    UUID facilityId,
    @NotNull @Size(min = 1, max = 300) String name,
    @Size(min = 1, max = 300) String zid,
    @NotNull DataOriginDto dataOrigin)
    implements SamplingPointDetails {

  public AddSamplingPointFileStateRequest(
      UUID referenceSamplingPointId,
      SamplingPointDetailsDto samplingPointDetails,
      DataOriginDto dataOrigin) {
    this(
        referenceSamplingPointId,
        samplingPointDetails.facilityId(),
        samplingPointDetails.name(),
        samplingPointDetails.zid(),
        dataOrigin);
  }

  public AddSamplingPointFileStateRequest(
      SamplingPointDetailsDto samplingPointDetails, DataOriginDto dataOrigin) {
    this(
        null,
        samplingPointDetails.facilityId(),
        samplingPointDetails.name(),
        samplingPointDetails.zid(),
        dataOrigin);
  }

  @Override
  public String toString() {
    return "AddSamplingPointFileStateRequest{"
        + "referenceSamplingPointId="
        + referenceSamplingPointId
        + ", facilityId="
        + facilityId
        + ", name='"
        + name
        + '\''
        + ", zid='"
        + zid
        + '\''
        + ", dataOrigin="
        + dataOrigin
        + '}';
  }
}
