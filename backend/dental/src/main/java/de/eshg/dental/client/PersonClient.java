/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.client;

import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesSortParameters;
import de.eshg.dental.domain.model.Child;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class PersonClient {

  private final PersonApi personApi;

  public PersonClient(PersonApi personApi) {
    this.personApi = personApi;
  }

  public List<GetPersonFileStateResponse> fetchPersonDataInBulk(
      List<Child> children, GetPersonFileStatesSortParameters sortParameters) {
    if (children.isEmpty()) {
      return List.of();
    }
    List<UUID> fileStateIds = children.stream().map(Child::getChildIdFromCentralFile).toList();
    GetPersonFileStatesResponse response =
        personApi.getPersonFileStates(new GetPersonFileStatesRequest(fileStateIds, sortParameters));

    int expectedResponseSize =
        sortParameters == null
            ? children.size()
            : Math.min(
                sortParameters.pageSize(),
                children.size() - (sortParameters.pageNumber() * sortParameters.pageSize()));
    if (response.personFileStates().size() < expectedResponseSize) {
      throw new IllegalStateException("Some persons were not found in the central file.");
    }

    return response.personFileStates();
  }

  public List<GetPersonFileStateResponse> fetchPersonDataInBulk(List<Child> children) {
    return fetchPersonDataInBulk(children, null);
  }
}
