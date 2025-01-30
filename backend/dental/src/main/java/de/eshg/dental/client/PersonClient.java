/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.client;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.GetFileStateIdsBulkRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesSortParameters;
import de.eshg.dental.domain.model.Child;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class PersonClient {

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
}
