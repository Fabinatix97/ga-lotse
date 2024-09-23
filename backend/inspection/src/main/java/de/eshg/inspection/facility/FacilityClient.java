/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility;

import static de.eshg.inspection.facility.FacilityMapper.mapBaseFacilityAddRequest;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.api.GetFileStateIdsResponse;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesRequest;
import de.eshg.base.centralfile.api.facility.PutFacilityRequest;
import de.eshg.base.centralfile.api.person.SyncFileStateRequest;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
public class FacilityClient {
  private final FacilityApi facilityApi;

  public FacilityClient(FacilityApi facilityApi) {
    this.facilityApi = facilityApi;
  }

  /** create a new "sachstand" for an existing base facility state id. */
  public UUID createNewFacilityFileState(UUID centralFileStateId) {
    GetFacilityFileStateResponse fileState = facilityApi.getFacilityFileState(centralFileStateId);
    AddFacilityFileStateRequest request = mapBaseFacilityAddRequest(fileState);
    return addFacilityFileState(request).id();
  }

  public AddFacilityFileStateResponse addFacilityFileState(AddFacilityFileStateRequest request) {
    return doAndForwardErrorCodes(() -> facilityApi.addFacilityFileState(request));
  }

  public GetFacilityFileStateResponse getFacilityFileState(UUID id) {
    return doAndForwardErrorCodes(() -> facilityApi.getFacilityFileState(id));
  }

  public List<UUID> getFacilityFileStateIdsWithSameReferenceFacility(UUID id) {
    return doAndForwardErrorCodes(
        () -> facilityApi.getFacilityFileStateIdsWithSameReferenceFacility(id).fileStateIds());
  }

  public List<AddFacilityFileStateResponse> getFacilityFileStates(List<UUID> fileStateIds) {
    return doAndForwardErrorCodes(
        () ->
            facilityApi
                .getFacilityFileStates(new GetFacilityFileStatesRequest(fileStateIds))
                .facilityFileStates());
  }

  public AddFacilityFileStateResponse syncFacilityFileState(UUID id, long version) {
    return doAndForwardErrorCodes(
        () -> facilityApi.syncFacilityFileState(id, new SyncFileStateRequest(version)));
  }

  public AddFacilityFileStateResponse updateFacilityFileStateAndReference(
      UUID id, PutFacilityRequest request) {
    return doAndForwardErrorCodes(
        () -> facilityApi.updateFacilityFileStateAndReference(id, request));
  }

  public List<UUID> getFacilityFileStateIdsAssociatedWithReferenceFacility(UUID id) {
    return doAndForwardErrorCodes(
        () -> {
          GetFileStateIdsResponse fileStateIdsResponse =
              facilityApi.getFacilityFileStateIdsAssociatedWithReferenceFacility(id);

          return fileStateIdsResponse.fileStateIds();
        });
  }

  private <T> T doAndForwardErrorCodes(Supplier<T> action) {
    try {
      return action.get();
    } catch (HttpClientErrorException e) {
      // We want to forward error codes 1:1 to the frontend.
      ErrorResponse errorResponse = e.getResponseBodyAs(ErrorResponse.class);
      if (errorResponse == null) {
        throw new BadRequestException(
            ErrorCode.UNEXPECTED_ERROR, "Could not read error from base module");
      }
      throw new BadRequestException(errorResponse.errorCode(), errorResponse.message());
    }
  }
}
