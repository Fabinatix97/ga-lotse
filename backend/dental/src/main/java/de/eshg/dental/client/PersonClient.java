/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.client;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.GetFileStateIdsBulkRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesSortParameters;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.centralfile.api.person.SyncFileStateRequest;
import de.eshg.dental.domain.model.Child;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
public class PersonClient {
  private static final Logger log = LoggerFactory.getLogger(PersonClient.class);

  private final PersonApi personApi;

  public PersonClient(PersonApi personApi) {
    this.personApi = personApi;
  }

  public List<GetPersonFileStateResponse> fetchPersonDataInBulk(
      List<UUID> fileStateIds, GetPersonFileStatesSortParameters sortParameters) {
    if (fileStateIds.isEmpty()) {
      return List.of();
    }
    GetPersonFileStatesResponse response =
        personApi.getPersonFileStates(new GetPersonFileStatesRequest(fileStateIds, sortParameters));

    int expectedResponseSize =
        sortParameters == null
            ? fileStateIds.size()
            : Math.min(
                sortParameters.pageSize(),
                fileStateIds.size() - (sortParameters.pageNumber() * sortParameters.pageSize()));
    if (response.personFileStates().size() < expectedResponseSize) {
      throw new IllegalStateException("Some persons were not found in the central file.");
    }

    return response.personFileStates();
  }

  public List<GetPersonFileStateResponse> fetchPersonDataInBulk(List<Child> children) {
    List<UUID> fileStateIds = children.stream().map(Child::getChildIdFromCentralFile).toList();
    return fetchPersonDataInBulk(fileStateIds, null);
  }

  public Map<UUID, List<UUID>> fetchAssociatedExternalIdsInBulk(List<UUID> externalIds) {
    if (externalIds.isEmpty()) {
      return Map.of();
    }
    return personApi
        .getPersonFileStateIdsAssociatedWithFileStates(new GetFileStateIdsBulkRequest(externalIds))
        .fileStateIds();
  }

  public UUID updateChildInCentralFile(UUID centralFileStateId, PersonDetailsDto updateRequest) {
    AddPersonFileStateResponse response =
        personApi.updatePersonFileStateAndReference(
            centralFileStateId,
            new de.eshg.base.centralfile.api.person.UpdatePersonRequest(updateRequest));
    UUID newCentralFileStateId = response.id();
    if (newCentralFileStateId.equals(centralFileStateId)) {
      log.info(
          "Updating the person did not generate a new file state ID. There was probably nothing to update.");
    }
    return newCentralFileStateId;
  }

  public UUID syncPerson(UUID centralFileStateId, long referenceVersion) {
    try {
      AddPersonFileStateResponse response =
          personApi.syncFileState(centralFileStateId, new SyncFileStateRequest(referenceVersion));
      return response.id();
    } catch (HttpClientErrorException.BadRequest e) {
      ErrorResponse body = e.getResponseBodyAs(ErrorResponse.class);
      if (body != null && ErrorCode.CONFLICT.equals(body.errorCode())) {
        throw new BadRequestException(
            ErrorCode.CONFLICT, "Conflict in central file: %s".formatted(body.message()));
      }
      throw e;
    }
  }
}
