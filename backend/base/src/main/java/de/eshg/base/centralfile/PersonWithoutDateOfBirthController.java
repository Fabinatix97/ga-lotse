/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile;

import de.eshg.base.centralfile.api.person.AddPersonWithoutDateOfBirthRequest;
import de.eshg.base.centralfile.api.person.AddPersonsWithoutDateOfBirthRequest;
import de.eshg.base.centralfile.api.person.GetPersonWithoutDateOfBirthResponse;
import de.eshg.base.centralfile.api.person.GetPersonsWithoutDateOfBirthResponse;
import de.eshg.base.centralfile.api.person.UpdatePersonWithoutDateOfBirthRequest;
import de.eshg.base.centralfile.mapper.PersonWithoutDateOfBirthMapper;
import de.eshg.base.centralfile.persistence.PersonWithoutDateOfBirthService;
import de.eshg.base.centralfile.persistence.entity.PersonWithoutDateOfBirth;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
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
        personWithoutDateOfBirthService.addPersonsWithoutDateOfBirth(List.of(newPerson)).getFirst();
    return PersonWithoutDateOfBirthMapper.mapPersonWithoutDateOfBirthToApi(persistedPerson);
  }

  @Override
  @Transactional
  public GetPersonsWithoutDateOfBirthResponse addPersonsWithoutDateOfBirth(
      AddPersonsWithoutDateOfBirthRequest request) {
    List<PersonWithoutDateOfBirth> newPerson =
        request.persons().stream()
            .map(PersonWithoutDateOfBirthMapper::mapPersonWithoutDateOfBirthToDm)
            .toList();
    List<PersonWithoutDateOfBirth> persistedPerson =
        personWithoutDateOfBirthService.addPersonsWithoutDateOfBirth(newPerson);
    return new GetPersonsWithoutDateOfBirthResponse(
        persistedPerson.stream()
            .map(PersonWithoutDateOfBirthMapper::mapPersonWithoutDateOfBirthToApi)
            .toList());
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
            .map(PersonWithoutDateOfBirthMapper::mapPersonWithoutDateOfBirthToApi)
            .toList());
  }

  @Override
  @Transactional
  public void deletePersonWithoutDateOfBirth(UUID id) {
    personWithoutDateOfBirthService.markForDeletion(List.of(id), Duration.ZERO);
  }

  @Override
  @Transactional
  public void deletePersonsWithoutDateOfBirth(List<UUID> ids) {
    personWithoutDateOfBirthService.markForDeletion(ids, Duration.ZERO);
  }

  @Override
  @Transactional
  public void markPersonsWithoutDateOfBirthForDeletion(List<UUID> ids) {
    personWithoutDateOfBirthService.markForDeletion(ids, Duration.ofDays(365));
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
