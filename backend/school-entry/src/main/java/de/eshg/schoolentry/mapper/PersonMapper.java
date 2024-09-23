/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.business.model.*;
import java.util.List;

public final class PersonMapper {

  private PersonMapper() {}

  public static PersonDetailsDto mapDetailsChildToDto(ChildDetailsData childData) {
    if (childData == null) {
      return null;
    }

    return new PersonDetailsDto(
        childData.version(),
        childData.fileStateId(),
        childData.fileStateOutdated(),
        childData.title(),
        childData.salutation(),
        childData.gender(),
        childData.firstName(),
        childData.lastName(),
        childData.dateOfBirth(),
        childData.nameAtBirth(),
        childData.placeOfBirth(),
        childData.countryOfBirth(),
        childData.emailAddresses(),
        childData.phoneNumbers(),
        childData.contactAddress(),
        childData.differentBillingAddress());
  }

  public static CreatePersonDto mapImportChildDataToCreatePersonDto(ImportChildData childData) {
    if (childData == null) {
      return null;
    }

    return new CreatePersonDto(
        childData.gender(),
        childData.firstName(),
        childData.lastName(),
        childData.dateOfBirth(),
        childData.placeOfBirth(),
        childData.countryOfBirth(),
        childData.phoneNumber() != null ? List.of(childData.phoneNumber()) : null,
        AddressMapper.mapToDto(childData.address()));
  }

  public static ChildDto mapChildToDto(ChildData childData) {
    if (childData == null) {
      return null;
    }

    return new ChildDto(
        childData.firstName(), childData.lastName(), childData.dateOfBirth(), childData.gender());
  }

  public static List<PersonDetailsDto> mapCustodiansToDto(
      List<CustodianDetailsData> custodiansData) {
    return custodiansData.stream().map(PersonMapper::mapCustodianToDto).toList();
  }

  public static PersonDetailsDto mapCustodianToDto(CustodianDetailsData custodianData) {
    if (custodianData == null) {
      return null;
    }

    return new PersonDetailsDto(
        custodianData.version(),
        custodianData.fileStateId(),
        custodianData.fileStateOutdated(),
        custodianData.title(),
        custodianData.salutation(),
        custodianData.gender(),
        custodianData.firstName(),
        custodianData.lastName(),
        custodianData.dateOfBirth(),
        custodianData.nameAtBirth(),
        custodianData.placeOfBirth(),
        custodianData.countryOfBirth(),
        custodianData.emailAddresses(),
        custodianData.phoneNumbers(),
        custodianData.contactAddress(),
        custodianData.differentBillingAddress());
  }

  public static de.eshg.base.centralfile.api.person.PersonDetailsDto mapToPersonDetailsDto(
      CreatePersonDto person) {
    return new de.eshg.base.centralfile.api.person.PersonDetailsDto(
        person.title(),
        person.salutation(),
        person.gender(),
        person.firstName(),
        person.lastName(),
        person.dateOfBirth(),
        person.nameAtBirth(),
        person.placeOfBirth(),
        person.countryOfBirth(),
        person.emailAddresses(),
        person.phoneNumbers(),
        person.contactAddress(),
        person.differentBillingAddress());
  }

  public static de.eshg.base.centralfile.api.person.PersonDetailsDto mapToPersonDetailsDto(
      UpdatePersonRequest child) {
    return new de.eshg.base.centralfile.api.person.PersonDetailsDto(
        child.title(),
        child.salutation(),
        child.gender(),
        child.firstName(),
        child.lastName(),
        child.dateOfBirth(),
        child.nameAtBirth(),
        child.placeOfBirth(),
        child.countryOfBirth(),
        child.emailAddresses(),
        child.phoneNumbers(),
        child.contactAddress(),
        child.differentBillingAddress());
  }

  public static de.eshg.base.centralfile.api.person.PersonDetailsDto mapToPersonDetailsDto(
      ImportCustodianData custodian) {
    return new de.eshg.base.centralfile.api.person.PersonDetailsDto(
        custodian.title(),
        custodian.salutation(),
        custodian.gender(),
        custodian.firstName(),
        custodian.lastName(),
        custodian.dateOfBirth(),
        AddressMapper.mapToDto(custodian.address()));
  }
}
