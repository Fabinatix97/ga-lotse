/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.persistence.centralfile;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.medsabroad.api.GetMedsAbroadProceduresSortOptions;
import de.eshg.medsabroad.api.PersonDto;
import de.eshg.medsabroad.mapper.MedsAbroadProcedureSpecificationMapper;
import de.eshg.medsabroad.mapper.PersonMapper;
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;
import de.eshg.rest.service.error.NotFoundException;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PersonClient {

  private static final Logger log = LoggerFactory.getLogger(PersonClient.class);

  private final PersonApi personApi;

  public PersonClient(PersonApi personApi) {
    this.personApi = personApi;
  }

  public UUID createPersonInCentralFile(PersonDto personDto) {
    AddPersonFileStateResponse personFileState =
        personApi.addPersonFileState(PersonMapper.toApiType(personDto));
    return personFileState.id();
  }

  public MedsAbroadProcedureDetails augmentProcedureWithPersonDetails(
      MedsAbroadProcedure procedure) {
    UUID personId = procedure.getCentralFilePersonId();
    GetPersonFileStateResponse personFromCentralFile = personApi.getPersonFileState(personId);
    return new MedsAbroadProcedureDetails(procedure, personFromCentralFile);
  }

  public Stream<MedsAbroadProcedureDetails> augmentProceduresWithPersonDetails(
      List<MedsAbroadProcedure> procedures, GetMedsAbroadProceduresSortOptions sortOptions) {
    if (procedures.isEmpty()) {
      return Stream.empty();
    }
    Map<UUID, GetPersonFileStateResponse> personsById = fetchAllRelatedPersons(procedures);
    return procedures.stream()
        .map(procedure -> augmentProcedureWithPersonDetails(procedure, personsById))
        .sorted(MedsAbroadProcedureSpecificationMapper.toSortComparator(sortOptions));
  }

  private Map<UUID, GetPersonFileStateResponse> fetchAllRelatedPersons(
      List<MedsAbroadProcedure> procedures) {

    List<UUID> personIdsToFetch =
        procedures.stream()
            .map(Procedure::getRelatedPersons)
            .flatMap(Collection::stream)
            .map(RelatedPerson::getCentralFileStateId)
            .toList();

    GetPersonFileStatesResponse response =
        personApi.getPersonFileStates(new GetPersonFileStatesRequest(personIdsToFetch));

    if (response.personFileStates().size() != personIdsToFetch.size()) {
      throw new IllegalStateException("Some persons were not found in the central file.");
    }

    return response.personFileStates().stream()
        .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));
  }

  private MedsAbroadProcedureDetails augmentProcedureWithPersonDetails(
      MedsAbroadProcedure procedure, Map<UUID, GetPersonFileStateResponse> personsById) {
    UUID personId = procedure.getCentralFilePersonId();
    GetPersonFileStateResponse personDetails = personsById.get(personId);
    if (personDetails == null) {
      throw new NotFoundException(
          "No related person found", "No related person for the given applicant found");
    }
    return new MedsAbroadProcedureDetails(procedure, personDetails);
  }
}
