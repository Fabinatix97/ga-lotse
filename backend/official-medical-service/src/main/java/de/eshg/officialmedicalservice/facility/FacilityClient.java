/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.facility;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityDiffResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesRequest;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesResponse;
import de.eshg.base.centralfile.api.facility.PutFacilityRequest;
import de.eshg.base.centralfile.api.person.SyncFileStateRequest;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
public class FacilityClient {
  private final FacilityApi facilityApi;

  public FacilityClient(FacilityApi facilityApi) {
    this.facilityApi = facilityApi;
  }

  public AddFacilityFileStateResponse addFacilityFileState(AddFacilityFileStateRequest request) {
    return doAndForwardErrorCodes(() -> facilityApi.addFacilityFileState(request));
  }

  public GetFacilityFileStateResponse getFacilityFileState(UUID id) {
    return doAndForwardErrorCodes(() -> facilityApi.getFacilityFileState(id));
  }

  public GetFacilityFileStatesResponse getFacilityFileStates(GetFacilityFileStatesRequest request) {
    return doAndForwardErrorCodes(() -> facilityApi.getFacilityFileStates(request));
  }

  public AddFacilityFileStateResponse updateFacilityFileStateAndReference(
      UUID id, PutFacilityRequest request) {
    return doAndForwardErrorCodes(
        () -> facilityApi.updateFacilityFileStateAndReference(id, request));
  }

  public UUID syncFacility(UUID fileStateId, long referenceVersion) {
    return doAndForwardErrorCodes(
        () ->
            facilityApi
                .syncFacilityFileState(fileStateId, new SyncFileStateRequest(referenceVersion))
                .id());
  }

  public GetFacilityDiffResponse getFacilityDiff(UUID fileStateId) {
    return doAndForwardErrorCodes(() -> facilityApi.getFacilityDiff(fileStateId));
  }

  private <T> T doAndForwardErrorCodes(Supplier<T> action) {
    try {
      return action.get();
    } catch (HttpClientErrorException e) {
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
