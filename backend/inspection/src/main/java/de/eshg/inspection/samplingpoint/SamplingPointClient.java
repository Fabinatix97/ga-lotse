/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.samplingpoint;

import de.eshg.base.centralfile.SamplingPointApi;
import de.eshg.base.centralfile.api.samplingpoint.AddSamplingPointFileStateRequest;
import de.eshg.base.centralfile.api.samplingpoint.AddSamplingPointFileStateResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetReferenceSamplingPointResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetReferenceSamplingPointsResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStateResponse;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStatesRequest;
import de.eshg.base.centralfile.api.samplingpoint.GetSamplingPointFileStatesResponse;
import de.eshg.base.centralfile.api.samplingpoint.UpdateReferenceSamplingPointRequest;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import java.util.Set;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;

@Component
public class SamplingPointClient {

  private final SamplingPointApi samplingPointApi;

  public SamplingPointClient(SamplingPointApi samplingPointApi) {
    this.samplingPointApi = samplingPointApi;
  }

  public GetSamplingPointFileStatesResponse searchSamplingPointFileStates(String zid) {
    return samplingPointApi.searchReferenceSamplingPoints(zid);
  }

  public AddSamplingPointFileStateResponse addSamplingPointFileState(
      AddSamplingPointFileStateRequest request) {
    return doAndForwardErrorCodes(() -> samplingPointApi.addSamplingPointFileState(request));
  }

  public GetSamplingPointFileStateResponse getSamplingPointFileState(UUID id) {
    return doAndForwardErrorCodes(() -> samplingPointApi.getSamplingPointFileState(id));
  }

  public GetSamplingPointFileStatesResponse getSamplingPointFileStates(Set<UUID> ids) {
    return doAndForwardErrorCodes(
        () ->
            samplingPointApi.getSamplingPointFileStates(
                new GetSamplingPointFileStatesRequest(ids)));
  }

  private GetReferenceSamplingPointResponse remapFacilityId(
      GetReferenceSamplingPointResponse sp, UUID facilityId) {
    return new GetReferenceSamplingPointResponse(
        sp.id(), sp.version(), sp.name(), sp.zid(), facilityId, sp.facilityName(), sp.dataOrigin());
  }

  public GetReferenceSamplingPointsResponse getReferenceSamplingPointsByFacilityFileStateId(
      UUID facilityFileStateId, UUID externalFacilityId, String namePrefix) {
    return doAndForwardErrorCodes(
        () -> {
          GetReferenceSamplingPointsResponse resp =
              samplingPointApi.getReferenceSamplingPointsByFacilityFileStateId(
                  facilityFileStateId, namePrefix);
          return new GetReferenceSamplingPointsResponse(
              resp.samplingPoints().stream()
                  .map(sp -> remapFacilityId(sp, externalFacilityId))
                  .toList());
        });
  }

  public GetReferenceSamplingPointResponse getReferenceSamplingPoint(UUID id) {
    return doAndForwardErrorCodes(() -> samplingPointApi.getReferenceSamplingPoint(id));
  }

  public GetReferenceSamplingPointsResponse getAllReferenceSamplingPoints(String namePrefix) {
    return doAndForwardErrorCodes(() -> samplingPointApi.getAllReferenceSamplingPoints(namePrefix));
  }

  public AddSamplingPointFileStateResponse updateReferenceSamplingPoint(
      UUID id, UpdateReferenceSamplingPointRequest request) {
    return doAndForwardErrorCodes(() -> samplingPointApi.updateReferenceSamplingPoint(id, request));
  }

  private <T> T doAndForwardErrorCodes(Supplier<T> action) {
    try {
      return action.get();
    } catch (HttpStatusCodeException e) {
      if (e.getStatusCode().isSameCodeAs(HttpStatus.UNAUTHORIZED)) {
        throw new BadRequestException(ErrorCode.UNAUTHORIZED, "Unauthorized base module call");
      }
      ErrorResponse errorResponse = e.getResponseBodyAs(ErrorResponse.class);
      if (errorResponse != null) {
        throw new BadRequestException(errorResponse.errorCode(), errorResponse.message());
      } else {
        throw new BadRequestException(
            ErrorCode.UNEXPECTED_ERROR, "Could not read error from base module");
      }
    }
  }
}
