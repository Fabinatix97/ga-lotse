/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility;

import static de.eshg.inspection.facility.FacilityMapper.mapBaseFacilityAddRequest;

import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.base.centralfile.api.GetFileStateIdsResponse;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesRequest;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStatesResponse;
import de.eshg.base.centralfile.api.facility.GetReferenceFacilityResponse;
import de.eshg.base.centralfile.api.facility.PutFacilityRequest;
import de.eshg.base.centralfile.api.facility.SearchReferenceFacilitiesResponse;
import de.eshg.base.centralfile.api.person.SyncFileStateRequest;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
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

  public GetReferenceFacilityResponse getReferenceFacility(UUID id) {
    return doAndForwardErrorCodes(() -> facilityApi.getReferenceFacility(id));
  }

  public List<UUID> getFacilityFileStateIdsWithSameReferenceFacility(UUID id) {
    return doAndForwardErrorCodes(
        () -> facilityApi.getFacilityFileStateIdsWithSameReferenceFacility(id).fileStateIds());
  }

  public List<GetFacilityFileStateResponse> getFacilityFileStates(List<UUID> fileStateIds) {
    return getFacilityFileStatesWithNotFound(fileStateIds).facilityFileStates();
  }

  public GetFacilityFileStatesResponse getFacilityFileStatesWithNotFound(List<UUID> fileStateIds) {
    return doAndForwardErrorCodes(
        () -> facilityApi.getFacilityFileStates(new GetFacilityFileStatesRequest(fileStateIds)));
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

  public void markFacilityFileStateForDeletion(Collection<UUID> fileStateIds) {
    doAndForwardErrorCodes(
        () -> {
          facilityApi.markFacilityFileStateForDeletion(
              new DeleteFileStatesRequest(new LinkedHashSet<>(fileStateIds)));
          return null;
        });
  }

  public SearchReferenceFacilitiesResponse searchReferenceFacilities(String name) {
    return doAndForwardErrorCodes(() -> facilityApi.searchReferenceFacilities(name));
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
