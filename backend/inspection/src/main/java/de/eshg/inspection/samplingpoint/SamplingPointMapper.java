/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.samplingpoint;

import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.samplingpoint.AddSamplingPointFileStateRequest;
import de.eshg.base.centralfile.api.samplingpoint.AddSamplingPointFileStateResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetReferenceSamplingPointResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStateResponse;
import de.eshg.base.centralfile.api.samplingpoint.SamplingPointDetailsDto;
import de.eshg.base.centralfile.api.samplingpoint.UpdateReferenceSamplingPointRequest;
import de.eshg.inspection.samplingpoint.api.*;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class SamplingPointMapper {

  static AddSamplingPointFileStateRequest mapBaseSamplingPointAddRequest(
      GetSamplingPointFileStateResponse baseSamplingPoint) {
    return new AddSamplingPointFileStateRequest(
        null,
        baseSamplingPoint.facilityId(),
        baseSamplingPoint.name(),
        baseSamplingPoint.zid(),
        baseSamplingPoint.dataOrigin());
  }

  static AddSamplingPointFileStateRequest mapBaseSamplingPointAddRequest(
      CreateSamplingPointRequest samplingPoint) {
    return new AddSamplingPointFileStateRequest(
        null,
        samplingPoint.facilityId(),
        samplingPoint.name(),
        samplingPoint.zid(),
        DataOriginDto.MANUAL);
  }

  static AddSamplingPointFileStateRequest mapBaseSamplingPointAddRequestWithCFSId(
      CreateSamplingPointRequest samplingPoint, UUID centralFileStateFacilityId) {
    return new AddSamplingPointFileStateRequest(
        null,
        centralFileStateFacilityId,
        samplingPoint.name(),
        samplingPoint.zid(),
        DataOriginDto.MANUAL);
  }

  static SamplingPointDto mapToSamplingPointDto(AddSamplingPointFileStateResponse samplingPoint) {
    return new SamplingPointDto(
        samplingPoint.id(),
        samplingPoint.zid(),
        samplingPoint.name(),
        new SamplingPointFacilityDto(
            samplingPoint.facilityId(), samplingPoint.facilityName(), null),
        samplingPoint.version());
  }

  static SamplingPointDto mapToSamplingPointDto(GetReferenceSamplingPointResponse samplingPoint) {
    return new SamplingPointDto(
        samplingPoint.id(),
        samplingPoint.zid(),
        samplingPoint.name(),
        new SamplingPointFacilityDto(
            samplingPoint.facilityId(), samplingPoint.facilityName(), null),
        samplingPoint.version());
  }

  static SamplingPointDto mapToSamplingPointDtoModifyFacility(
      GetReferenceSamplingPointResponse samplingPoint, SamplingPointFacilityDto facility) {
    return new SamplingPointDto(
        samplingPoint.id(),
        samplingPoint.zid(),
        samplingPoint.name(),
        facility,
        samplingPoint.version());
  }

  static UpdateReferenceSamplingPointRequest mapToUpdateReferenceSamplingPointRequest(
      UpdateSamplingPointRequest samplingPoint) {

    return new UpdateReferenceSamplingPointRequest(
        new SamplingPointDetailsDto(
            samplingPoint.facilityId(), samplingPoint.name(), samplingPoint.zid()),
        samplingPoint.version());
  }
}
