/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.mapper;

import static de.eshg.base.address.mapper.AddressMapper.mapAddressToApi;
import static de.eshg.base.util.MappingUtil.extractStrings;
import static de.eshg.base.util.MappingUtil.mapDataOriginToApi;
import static de.eshg.base.util.MappingUtil.mapDataOriginToDm;
import static de.eshg.base.util.MappingUtil.mapGenderToApi;
import static de.eshg.base.util.MappingUtil.mapGenderToDm;
import static de.eshg.base.util.MappingUtil.mapSalutationToApi;
import static de.eshg.base.util.MappingUtil.mapSalutationToDm;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.address.mapper.AddressMapper;
import de.eshg.base.centralfile.api.DiffDto;
import de.eshg.base.centralfile.api.person.*;
import de.eshg.base.centralfile.persistence.entity.*;
import de.eshg.base.centralfile.persistence.entity.BirthDetails;
import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.centralfile.persistence.entity.PersonAddress;
import de.eshg.base.centralfile.persistence.entity.PersonEmailAddress;
import de.eshg.base.centralfile.persistence.entity.PersonPhoneNumber;
import de.eshg.base.util.PersonDiffer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.apache.commons.lang3.builder.Diff;
import org.apache.commons.lang3.builder.DiffResult;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class PersonMapper {

  public static AddPersonFileStateResponse mapPersonFileStateToApi(Person person) {
    return new AddPersonFileStateResponse(
        person.getExternalId(),
        person.getTitle(),
        mapSalutationToApi(person.getSalutation()),
        mapGenderToApi(person.getGender()),
        person.getFirstName(),
        person.getLastName(),
        person.getBirthDetails().dateOfBirth(),
        person.getBirthDetails().nameAtBirth(),
        person.getBirthDetails().placeOfBirth(),
        person.getBirthDetails().countryOfBirth(),
        extractStrings(person.getEmailAddresses(), PersonEmailAddress::getEmailAddress),
        extractStrings(person.getPhoneNumbers(), PersonPhoneNumber::getPhoneNumber),
        person.getReferenceVersion(),
        mapAddressToApi(person.getContactAddress()),
        mapAddressToApi(person.getDifferentBillingAddress()),
        mapDataOriginToApi(person.getDataOrigin()));
  }

  public static PersonDetailsDto mapPersonDetailsToApi(Person person) {
    return new PersonDetailsDto(
        person.getTitle(),
        mapSalutationToApi(person.getSalutation()),
        mapGenderToApi(person.getGender()),
        person.getFirstName(),
        person.getLastName(),
        person.getBirthDetails().dateOfBirth(),
        person.getBirthDetails().nameAtBirth(),
        person.getBirthDetails().placeOfBirth(),
        person.getBirthDetails().countryOfBirth(),
        extractStrings(person.getEmailAddresses(), PersonEmailAddress::getEmailAddress),
        extractStrings(person.getPhoneNumbers(), PersonPhoneNumber::getPhoneNumber),
        mapAddressToApi(person.getContactAddress()),
        mapAddressToApi(person.getDifferentBillingAddress()));
  }

  public static GetReferencePersonResponse mapReferencePersonToApi(Person person) {
    return new GetReferencePersonResponse(
        person.getExternalId(),
        person.getVersion(),
        person.getTitle(),
        mapSalutationToApi(person.getSalutation()),
        mapGenderToApi(person.getGender()),
        person.getFirstName(),
        person.getLastName(),
        person.getBirthDetails().dateOfBirth(),
        person.getBirthDetails().nameAtBirth(),
        person.getBirthDetails().placeOfBirth(),
        person.getBirthDetails().countryOfBirth(),
        extractStrings(person.getEmailAddresses(), PersonEmailAddress::getEmailAddress),
        extractStrings(person.getPhoneNumbers(), PersonPhoneNumber::getPhoneNumber),
        mapAddressToApi(person.getContactAddress()),
        mapAddressToApi(person.getDifferentBillingAddress()),
        mapDataOriginToApi(person.getDataOrigin()));
  }

  public static GetPersonFileStateResponse mapPersonToGetPersonFileStateResponse(
      Person person, Boolean outdated) {
    return new GetPersonFileStateResponse(
        person.getExternalId(),
        person.getTitle(),
        mapSalutationToApi(person.getSalutation()),
        mapGenderToApi(person.getGender()),
        person.getFirstName(),
        person.getLastName(),
        person.getBirthDetails().dateOfBirth(),
        person.getBirthDetails().nameAtBirth(),
        person.getBirthDetails().placeOfBirth(),
        person.getBirthDetails().countryOfBirth(),
        extractStrings(person.getEmailAddresses(), PersonEmailAddress::getEmailAddress),
        extractStrings(person.getPhoneNumbers(), PersonPhoneNumber::getPhoneNumber),
        person.getReferenceVersion(),
        mapAddressToApi(person.getContactAddress()),
        mapAddressToApi(person.getDifferentBillingAddress()),
        outdated,
        mapDataOriginToApi(person.getDataOrigin()));
  }

  public static GetPersonFileStatesResponse mapToGetPersonFileStatesResponse(
      List<UUID> queryIds,
      List<Person> foundFileStates,
      Pageable pageable,
      Map<UUID, Boolean> outdatedByFileStateId) {
    Map<UUID, GetPersonFileStateResponse> mappedPersonsById =
        mapToApiAndGroupById(foundFileStates, outdatedByFileStateId);

    List<GetPersonFileStateResponse> personResponses = new ArrayList<>(mappedPersonsById.values());

    if (pageable.isUnpaged()) {
      personResponses.sort(
          Comparator.comparingInt(
              response -> {
                int index = queryIds.indexOf(response.id());
                Assert.isTrue(index >= 0, response + " was not queried");
                return index;
              }));
    }

    for (GetPersonFileStateResponse personResponse : personResponses) {
      Assert.isTrue(
          queryIds.contains(personResponse.id()), "Unexpected response: " + personResponse);
    }

    List<UUID> notFoundPersonIds;
    if (pageable.isUnpaged()) {
      notFoundPersonIds =
          queryIds.stream().filter(id -> !mappedPersonsById.containsKey(id)).toList();
    } else {
      notFoundPersonIds = List.of();
    }

    return new GetPersonFileStatesResponse(personResponses, notFoundPersonIds);
  }

  private static Map<UUID, GetPersonFileStateResponse> mapToApiAndGroupById(
      List<Person> persons, Map<UUID, Boolean> isOutdated) {
    return persons.stream()
        .map(
            person ->
                PersonMapper.mapPersonToGetPersonFileStateResponse(
                    person, isOutdated.getOrDefault(person.getExternalId(), null)))
        .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));
  }

  public static DiffDto<PersonDetailsDto> mapToPersonDiffApi(Person person, Person refPerson) {
    DiffResult<Person> diff = PersonDiffer.diff(person, refPerson);
    List<String> changedPersonFields = diff.getDiffs().stream().map(Diff::getFieldName).toList();
    return new DiffDto<>(
        changedPersonFields,
        mapPersonDetailsToApi(diff.getLeft()),
        mapPersonDetailsToApi(diff.getRight()));
  }

  public static Person mapPersonToDm(AddPersonFileStateRequest request) {
    Person person = mapPersonDetailsToDm(request);
    person.setDataOrigin(mapDataOriginToDm(request.dataOrigin()));
    return person;
  }

  public static Person mapPersonToDm(ExternalAddPersonFileStateRequest request) {
    return mapPersonDetailsToDm(request);
  }

  public static Person mapPersonToDm(UpdatePersonRequest request) {
    return mapPersonDetailsToDm(request.updatedPerson());
  }

  public static Person mapPersonToDm(UpdatePersonInBulkRequest request) {
    return mapPersonDetailsToDm(request.updatedPerson());
  }

  public static Person mapPersonToDm(UpdateReferencePersonRequest request) {
    return mapPersonDetailsToDm(request.personDetails());
  }

  private static Person mapPersonDetailsToDm(PersonDetails personDetails) {
    Person person = new Person();
    person.setTitle(personDetails.title());
    person.setSalutation(mapSalutationToDm(personDetails.salutation()));
    person.setGender(mapGenderToDm(personDetails.gender()));
    person.setFirstName(personDetails.firstName());
    person.setLastName(personDetails.lastName());
    person.setBirthDetails(mapBirthDetailsToDm(personDetails));
    person.addEmailAddresses(mapEmailAddressesToDm(personDetails.emailAddresses()));
    person.addPhoneNumbers(mapPhoneNumbersToDm(personDetails.phoneNumbers()));
    person.setContactAddress(mapAddressToDm(personDetails.contactAddress()));
    person.setDifferentBillingAddress(mapAddressToDm(personDetails.differentBillingAddress()));
    return person;
  }

  private static BirthDetails mapBirthDetailsToDm(PersonDetails personDetails) {
    return new BirthDetails(
        personDetails.dateOfBirth(),
        personDetails.nameAtBirth(),
        personDetails.placeOfBirth(),
        personDetails.countryOfBirth());
  }

  public static List<PersonEmailAddress> mapEmailAddressesToDm(List<String> emailAddresses) {
    if (emailAddresses == null) {
      return List.of();
    }
    return emailAddresses.stream().map(PersonMapper::mapEmailAddressToDm).toList();
  }

  private static PersonEmailAddress mapEmailAddressToDm(String emailAddress) {
    PersonEmailAddress personEmailAddress = new PersonEmailAddress();
    personEmailAddress.setEmailAddress(emailAddress);
    return personEmailAddress;
  }

  public static List<PersonPhoneNumber> mapPhoneNumbersToDm(List<String> phoneNumbers) {
    if (phoneNumbers == null) {
      return List.of();
    }
    return phoneNumbers.stream().map(PersonMapper::mapPhoneNumberToDm).toList();
  }

  private static PersonPhoneNumber mapPhoneNumberToDm(String phoneNumber) {
    PersonPhoneNumber personPhoneNumber = new PersonPhoneNumber();
    personPhoneNumber.setPhoneNumber(phoneNumber);
    return personPhoneNumber;
  }

  public static PersonAddress mapAddressToDm(AddressDto address) {
    return switch (address) {
      case null -> null;
      case PostboxAddressDto postboxAddress ->
          AddressMapper.mapPostboxAddressIntoDm(postboxAddress, new PostboxPersonAddress());
      case DomesticAddressDto domesticAddress ->
          AddressMapper.mapDomesticAddressIntoDm(domesticAddress, new DomesticPersonAddress());
    };
  }
}
