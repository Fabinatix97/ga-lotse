/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import de.eshg.base.centralfile.api.person.AddPersonWithoutDateOfBirthRequest;
import de.eshg.base.centralfile.api.person.GetPersonWithoutDateOfBirthResponse;
import de.eshg.base.centralfile.api.person.GetPersonsWithoutDateOfBirthResponse;
import de.eshg.base.centralfile.api.person.UpdatePersonWithoutDateOfBirthRequest;
import de.eshg.base.centralfile.mapper.PersonWithoutDateOfBirthMapper;
import de.eshg.base.centralfile.persistence.PersonWithoutDateOfBirthService;
import de.eshg.base.centralfile.persistence.entity.PersonWithoutDateOfBirth;
import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "PersonWithoutDateOfBirth")
public class PersonWithoutDateOfBirthController implements PersonWithoutDateOfBirthApi {

  private final PersonWithoutDateOfBirthService personWithoutDateOfBirthService;

  public PersonWithoutDateOfBirthController(
      PersonWithoutDateOfBirthService personWithoutDateOfBirthService) {
    this.personWithoutDateOfBirthService = personWithoutDateOfBirthService;
  }

  @Override
  @Transactional
  public GetPersonWithoutDateOfBirthResponse addPersonWithoutDateOfBirth(
      AddPersonWithoutDateOfBirthRequest request) {
    PersonWithoutDateOfBirth newPerson =
        PersonWithoutDateOfBirthMapper.mapPersonWithoutDateOfBirthToDm(request);
    PersonWithoutDateOfBirth persistedPerson =
        personWithoutDateOfBirthService.addPersonWithoutDateOfBirth(newPerson);
    return PersonWithoutDateOfBirthMapper.mapPersonWithoutDateOfBirthToApi(persistedPerson);
  }

  @Override
  @Transactional(readOnly = true)
  public GetPersonWithoutDateOfBirthResponse getPersonWithoutDateOfBirth(UUID id) {
    PersonWithoutDateOfBirth person =
        personWithoutDateOfBirthService.getPersonWithoutDateOfBirth(id);
    return PersonWithoutDateOfBirthMapper.mapPersonWithoutDateOfBirthToApi(person);
  }

  @Override
  @Transactional(readOnly = true)
  public GetPersonsWithoutDateOfBirthResponse getPersonsWithoutDateOfBirth(List<UUID> ids) {
    List<PersonWithoutDateOfBirth> persons =
        personWithoutDateOfBirthService.getBulkPersonsWithoutDateOfBirth(ids);
    return new GetPersonsWithoutDateOfBirthResponse(
        persons.stream()
            .collect(
                Collectors.toMap(
                    SequencedBaseEntityWithExternalId::getExternalId,
                    PersonWithoutDateOfBirthMapper::mapPersonWithoutDateOfBirthToApi)));
  }

  @Override
  @Transactional
  public void deletePersonWithoutDateOfBirth(UUID id) {
    personWithoutDateOfBirthService.deletePersonWithoutDateOfBirth(List.of(id));
  }

  @Override
  @Transactional
  public void deletePersonsWithoutDateOfBirth(List<UUID> id) {
    personWithoutDateOfBirthService.deletePersonWithoutDateOfBirth(id);
  }

  @Override
  @Transactional
  public GetPersonWithoutDateOfBirthResponse updatePersonWithoutDateOfBirth(
      UUID id, UpdatePersonWithoutDateOfBirthRequest request) {
    PersonWithoutDateOfBirth updatedPerson =
        PersonWithoutDateOfBirthMapper.mapPersonWithoutDateOfBirthToDm(request);
    PersonWithoutDateOfBirth persistedPerson =
        personWithoutDateOfBirthService.updatePersonWithoutDateOfBirth(id, updatedPerson);
    return PersonWithoutDateOfBirthMapper.mapPersonWithoutDateOfBirthToApi(persistedPerson);
  }
}
