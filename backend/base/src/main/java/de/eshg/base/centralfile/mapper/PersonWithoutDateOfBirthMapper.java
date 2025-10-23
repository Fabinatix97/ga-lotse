/*
 * Copyright 2025 cronn GmbH
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

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.address.mapper.AddressMapper;
import de.eshg.base.centralfile.api.person.*;
import de.eshg.base.centralfile.persistence.entity.*;
import de.eshg.base.centralfile.persistence.entity.PersonAddress;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class PersonWithoutDateOfBirthMapper {

  private PersonWithoutDateOfBirthMapper() {
    /* static mapper class */
  }

  public static PersonWithoutDateOfBirth mapPersonWithoutDateOfBirthToDm(
      AddPersonWithoutDateOfBirthRequest request) {
    PersonWithoutDateOfBirth person = new PersonWithoutDateOfBirth();
    person.setTitle(request.title());
    person.setSalutation(mapSalutationToDm(request.salutation()));
    person.setGender(mapGenderToDm(request.gender()));
    person.setFirstName(request.firstName());
    person.setLastName(request.lastName());
    person.addEmailAddresses(mapEmailAddressesToDm(request.emailAddresses()));
    person.addPhoneNumbers(mapPhoneNumbersToDm(request.phoneNumbers()));
    person.setContactAddress(mapAddressToDm(request.contactAddress()));
    person.setDataOrigin(mapDataOriginToDm(request.dataOrigin()));
    return person;
  }

  public static PersonWithoutDateOfBirth mapPersonWithoutDateOfBirthToDm(
      UpdatePersonWithoutDateOfBirthRequest request) {
    PersonWithoutDateOfBirth person = new PersonWithoutDateOfBirth();
    person.setTitle(request.title());
    person.setSalutation(mapSalutationToDm(request.salutation()));
    person.setGender(mapGenderToDm(request.gender()));
    person.setFirstName(request.firstName());
    person.setLastName(request.lastName());
    person.addEmailAddresses(mapEmailAddressesToDm(request.emailAddresses()));
    person.addPhoneNumbers(mapPhoneNumbersToDm(request.phoneNumbers()));
    person.setContactAddress(mapAddressToDm(request.contactAddress()));
    return person;
  }

  public static GetPersonWithoutDateOfBirthResponse mapPersonWithoutDateOfBirthToApi(
      PersonWithoutDateOfBirth person) {
    return new GetPersonWithoutDateOfBirthResponse(
        person.getExternalId(),
        person.getTitle(),
        mapSalutationToApi(person.getSalutation()),
        mapGenderToApi(person.getGender()),
        person.getFirstName(),
        person.getLastName(),
        extractStrings(
            person.getEmailAddresses(), PersonWithoutDateOfBirthEmailAddress::getEmailAddress),
        extractStrings(
            person.getPhoneNumbers(), PersonWithoutDateOfBirthPhoneNumber::getPhoneNumber),
        mapAddressToApi(person.getContactAddress()),
        mapDataOriginToApi(person.getDataOrigin()));
  }

  public static List<PersonWithoutDateOfBirthEmailAddress> mapEmailAddressesToDm(
      List<String> emailAddresses) {
    if (emailAddresses == null) {
      return List.of();
    }
    return emailAddresses.stream()
        .map(PersonWithoutDateOfBirthMapper::mapEmailAddressToDm)
        .toList();
  }

  private static PersonWithoutDateOfBirthEmailAddress mapEmailAddressToDm(String emailAddress) {
    PersonWithoutDateOfBirthEmailAddress personEmailAddress =
        new PersonWithoutDateOfBirthEmailAddress();
    personEmailAddress.setEmailAddress(emailAddress);
    return personEmailAddress;
  }

  public static List<PersonWithoutDateOfBirthPhoneNumber> mapPhoneNumbersToDm(
      List<String> phoneNumbers) {
    if (phoneNumbers == null) {
      return List.of();
    }
    return phoneNumbers.stream().map(PersonWithoutDateOfBirthMapper::mapPhoneNumberToDm).toList();
  }

  private static PersonWithoutDateOfBirthPhoneNumber mapPhoneNumberToDm(String phoneNumber) {
    PersonWithoutDateOfBirthPhoneNumber personPhoneNumber =
        new PersonWithoutDateOfBirthPhoneNumber();
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
