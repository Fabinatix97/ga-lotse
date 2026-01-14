/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.client;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.GetFileStateIdsBulkRequest;
import de.eshg.base.centralfile.api.GetFileStateIdsResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesSortParameters;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.centralfile.api.person.SyncFileStateRequest;
import de.eshg.base.centralfile.api.person.UpdatePersonRequest;
import de.eshg.base.centralfile.api.person.UpdateReferencePersonInBulkRequest;
import de.eshg.base.centralfile.api.person.UpdateReferencePersonsRequest;
import de.eshg.dental.api.CreateChildRequest;
import de.eshg.dental.business.model.ChildWithPersonData;
import de.eshg.dental.domain.model.Child;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import de.eshg.rest.service.error.NotFoundException;
import java.util.ArrayList;
import java.util.Collection;
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

  public GetPersonFileStateResponse fetchPersonData(Child child) {
    return personApi.getPersonFileState(child.getChildIdFromCentralFile());
  }

  public List<ChildWithPersonData> fetchChildWithPersonDataInBulk(List<Child> children) {
    Map<UUID, GetPersonFileStateResponse> personMap = fetchPersonDataInBulkToMap(children);
    return children.stream()
        .map(
            child ->
                new ChildWithPersonData(child, personMap.get(child.getChildIdFromCentralFile())))
        .toList();
  }

  public Map<UUID, GetPersonFileStateResponse> fetchPersonDataInBulkToMap(
      List<Child> children, boolean checkOutdated) {
    return fetchPersonDataInBulk(children, checkOutdated).stream()
        .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));
  }

  public Map<UUID, GetPersonFileStateResponse> fetchPersonDataInBulkToMap(List<Child> children) {
    return fetchPersonDataInBulk(children).stream()
        .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));
  }

  public List<GetPersonFileStateResponse> fetchPersonDataInBulk(List<Child> children) {
    return fetchPersonDataInBulk(children, false);
  }

  public List<GetPersonFileStateResponse> fetchPersonDataInBulk(
      List<Child> children, boolean checkOutdated) {
    List<UUID> fileStateIds = children.stream().map(Child::getChildIdFromCentralFile).toList();
    return fetchPersonDataInBulk(fileStateIds, null, checkOutdated);
  }

  public List<GetPersonFileStateResponse> fetchPersonDataInBulk(
      List<UUID> fileStateIds, GetPersonFileStatesSortParameters sortParameters) {
    return fetchPersonDataInBulk(fileStateIds, sortParameters, false);
  }

  public List<GetPersonFileStateResponse> fetchPersonDataInBulk(
      List<UUID> fileStateIds,
      GetPersonFileStatesSortParameters sortParameters,
      boolean checkOutdated) {
    if (fileStateIds.isEmpty()) {
      return List.of();
    }
    GetPersonFileStatesResponse response =
        personApi.getPersonFileStates(
            new GetPersonFileStatesRequest(fileStateIds, checkOutdated, sortParameters));

    int expectedResponseSize =
        !hasPagination(sortParameters)
            ? fileStateIds.size()
            : Math.min(
                sortParameters.pageSize(),
                fileStateIds.size() - (sortParameters.pageNumber() * sortParameters.pageSize()));
    if (response.personFileStates().size() < expectedResponseSize) {
      throw new IllegalStateException("Some persons were not found in the central file.");
    }

    return response.personFileStates();
  }

  private boolean hasPagination(GetPersonFileStatesSortParameters sortParameters) {
    return sortParameters != null
        && sortParameters.pageSize() != null
        && sortParameters.pageNumber() != null;
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
            centralFileStateId, new UpdatePersonRequest(updateRequest));
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

  public List<UUID> getPersonFileStateIdsAssociatedWithFileState(UUID childIdFromCentralFile) {
    GetFileStateIdsResponse response =
        personApi.getPersonFileStateIdsAssociatedWithFileState(childIdFromCentralFile);
    return response.fileStateIds();
  }

  public List<UUID> getPersonFileStateIdsAssociatedWithReferencePerson(
      UUID childIdFromCentralFile) {
    GetFileStateIdsResponse response =
        personApi.getPersonFileStateIdsAssociatedWithReferencePerson(childIdFromCentralFile);
    return response.fileStateIds();
  }

  public List<UUID> addChildren(Collection<CreateChildRequest> requests, DataOriginDto dataOrigin) {
    List<AddPersonFileStateRequest> personsToAdd =
        requests.stream()
            .map(request -> mapToAddPersonFileStateRequest(dataOrigin, request))
            .toList();

    AddPersonFileStatesResponse response =
        personApi.addPersonFileStates(new AddPersonFileStatesRequest(personsToAdd));

    return response.personFileStateIds();
  }

  private static AddPersonFileStateRequest mapToAddPersonFileStateRequest(
      DataOriginDto dataOrigin, CreateChildRequest request) {
    return new AddPersonFileStateRequest(
        request.referenceId(),
        new PersonDetailsDto(
            request.title(),
            request.salutation(),
            request.gender(),
            request.firstName(),
            request.lastName(),
            request.dateOfBirth(),
            request.nameAtBirth(),
            request.placeOfBirth(),
            request.countryOfBirth(),
            request.emailAddresses(),
            request.phoneNumbers(),
            request.contactAddress(),
            request.differentBillingAddress()),
        dataOrigin);
  }

  public AddPersonFileStatesResponse duplicatePersonFileStates(List<Child> children) {
    List<GetPersonFileStateResponse> personFileStates = fetchPersonDataInBulk(children);
    List<AddPersonFileStateRequest> fileStateAddRequests =
        personFileStates.stream().map(PersonClient::mapToAddPersonFileStateRequest).toList();
    return personApi.addPersonFileStates(new AddPersonFileStatesRequest(fileStateAddRequests));
  }

  private static AddPersonFileStateRequest mapToAddPersonFileStateRequest(
      GetPersonFileStateResponse personFileState) {
    return new AddPersonFileStateRequest(
        new PersonDetailsDto(
            personFileState.title(),
            personFileState.salutation(),
            personFileState.gender(),
            personFileState.firstName(),
            personFileState.lastName(),
            personFileState.dateOfBirth(),
            personFileState.nameAtBirth(),
            personFileState.placeOfBirth(),
            personFileState.countryOfBirth(),
            personFileState.emailAddresses(),
            personFileState.phoneNumbers(),
            personFileState.contactAddress(),
            personFileState.differentBillingAddress()),
        personFileState.dataOrigin());
  }

  public void updateReferencePersons(Map<CreateChildRequest, Child> createdChildren) {
    Map<UUID, GetReferencePersonResponse> referencePersons =
        personApi
            .getReferencePersons(
                createdChildren.values().stream().map(Child::getChildIdFromCentralFile).toList())
            .personsWithReferencingFileStateId();

    List<UpdateReferencePersonInBulkRequest> updateReferencePersonInBulkRequests =
        new ArrayList<>();

    for (Map.Entry<CreateChildRequest, Child> entry : createdChildren.entrySet()) {
      CreateChildRequest request = entry.getKey();
      Child child = entry.getValue();

      GetReferencePersonResponse referencePerson =
          referencePersons.entrySet().stream()
              .filter(
                  getReferencePersonResponse ->
                      getReferencePersonResponse.getKey().equals(child.getChildIdFromCentralFile()))
              .map(Map.Entry::getValue)
              .findFirst()
              .orElseThrow(() -> new NotFoundException("ReferencePerson not found"));

      UpdateReferencePersonInBulkRequest updatePersonRequest =
          mapToUpdatePersonBulkRequest(referencePerson, child, request);
      updateReferencePersonInBulkRequests.add(updatePersonRequest);
    }

    if (!updateReferencePersonInBulkRequests.isEmpty()) {
      personApi.updateReferencePersons(
          new UpdateReferencePersonsRequest(updateReferencePersonInBulkRequests));
    }
  }

  private static UpdateReferencePersonInBulkRequest mapToUpdatePersonBulkRequest(
      GetReferencePersonResponse referencePerson, Child child, CreateChildRequest request) {
    return new UpdateReferencePersonInBulkRequest(
        referencePerson.id(),
        child.getExternalId(),
        referencePerson.version(),
        new UpdatePersonRequest(
            request.title(),
            request.salutation(),
            request.gender(),
            request.firstName(),
            request.lastName(),
            request.dateOfBirth(),
            request.nameAtBirth(),
            request.placeOfBirth(),
            request.countryOfBirth(),
            request.emailAddresses(),
            request.phoneNumbers(),
            request.contactAddress(),
            request.differentBillingAddress()));
  }
}
