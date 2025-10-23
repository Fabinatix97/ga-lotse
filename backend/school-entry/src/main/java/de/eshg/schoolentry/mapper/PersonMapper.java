/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import static de.eshg.schoolentry.mapper.AddressMapper.mapToBaseAddressDto;
import static de.eshg.schoolentry.mapper.AddressMapper.mapToSchoolEntryAddressDto;
import static de.eshg.schoolentry.mapper.GenderMapper.mapToBaseGenderDto;
import static de.eshg.schoolentry.mapper.GenderMapper.mapToSchoolEntryGenderDto;
import static de.eshg.schoolentry.mapper.SalutationMapper.mapToBaseSalutationDto;
import static de.eshg.schoolentry.mapper.SalutationMapper.mapToSchoolEntrySalutationDto;

import de.eshg.lib.xlsximport.util.AddressMapper;
import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.business.model.*;
import java.util.List;

public final class PersonMapper {

  private PersonMapper() {}

  public static List<CustodianDetailsDto> mapCustodiansToDto(
      List<PersonDetailsData> custodiansData) {
    return custodiansData.stream().map(PersonMapper::mapPersonDetailsToCustodianDto).toList();
  }

  public static CustodianDetailsDto mapPersonDetailsToCustodianDto(PersonDetailsData detailsData) {
    if (detailsData == null) {
      return null;
    }

    return new CustodianDetailsDto(
        detailsData.version(),
        detailsData.humanReadableId(),
        detailsData.fileStateId(),
        detailsData.fileStateOutdated(),
        detailsData.title(),
        mapToSchoolEntrySalutationDto(detailsData.salutation()),
        mapToSchoolEntryGenderDto(detailsData.gender()),
        detailsData.firstName(),
        detailsData.lastName(),
        detailsData.dateOfBirth(),
        detailsData.nameAtBirth(),
        detailsData.placeOfBirth(),
        detailsData.countryOfBirth(),
        detailsData.emailAddresses(),
        detailsData.phoneNumbers(),
        mapToSchoolEntryAddressDto(detailsData.contactAddress()),
        mapToSchoolEntryAddressDto(detailsData.differentBillingAddress()));
  }

  public static PersonDetailsDto mapPersonDetailsToDto(PersonDetailsData detailsData) {
    if (detailsData == null) {
      return null;
    }

    return new PersonDetailsDto(
        detailsData.version(),
        detailsData.humanReadableId(),
        detailsData.fileStateId(),
        detailsData.fileStateOutdated(),
        detailsData.title(),
        mapToSchoolEntrySalutationDto(detailsData.salutation()),
        mapToSchoolEntryGenderDto(detailsData.gender()),
        detailsData.firstName(),
        detailsData.lastName(),
        detailsData.dateOfBirth(),
        detailsData.nameAtBirth(),
        detailsData.placeOfBirth(),
        detailsData.countryOfBirth(),
        detailsData.emailAddresses(),
        detailsData.phoneNumbers(),
        mapToSchoolEntryAddressDto(detailsData.contactAddress()),
        mapToSchoolEntryAddressDto(detailsData.differentBillingAddress()));
  }

  public static CreatePersonDto mapImportChildDataToCreatePersonDto(ImportChildData childData) {
    if (childData == null) {
      return null;
    }

    return new CreatePersonDto(
        mapToSchoolEntryGenderDto(childData.gender()),
        childData.firstName(),
        childData.lastName(),
        childData.dateOfBirth(),
        childData.placeOfBirth(),
        childData.countryOfBirth(),
        childData.phoneNumber() != null ? List.of(childData.phoneNumber()) : null,
        childData.email() != null ? List.of(childData.email()) : null,
        mapToSchoolEntryAddressDto(AddressMapper.mapToDto(childData.address())));
  }

  public static ChildDto mapChildToDto(ChildData childData) {
    if (childData == null) {
      return null;
    }

    return new ChildDto(
        childData.firstName(),
        childData.lastName(),
        childData.dateOfBirth(),
        mapToSchoolEntryGenderDto(childData.gender()));
  }

  public static de.eshg.base.centralfile.api.person.PersonDetailsDto mapToPersonDetailsDto(
      CreatePersonDto person) {
    return new de.eshg.base.centralfile.api.person.PersonDetailsDto(
        person.title(),
        mapToBaseSalutationDto(person.salutation()),
        mapToBaseGenderDto(person.gender()),
        person.firstName(),
        person.lastName(),
        person.dateOfBirth(),
        person.nameAtBirth(),
        person.placeOfBirth(),
        person.countryOfBirth(),
        person.emailAddresses(),
        person.phoneNumbers(),
        mapToBaseAddressDto(person.contactAddress()),
        mapToBaseAddressDto(person.differentBillingAddress()));
  }

  public static de.eshg.base.centralfile.api.person.PersonDetailsDto mapToPersonDetailsDto(
      UpdatePersonRequest child) {
    return new de.eshg.base.centralfile.api.person.PersonDetailsDto(
        child.title(),
        mapToBaseSalutationDto(child.salutation()),
        mapToBaseGenderDto(child.gender()),
        child.firstName(),
        child.lastName(),
        child.dateOfBirth(),
        child.nameAtBirth(),
        child.placeOfBirth(),
        child.countryOfBirth(),
        child.emailAddresses(),
        child.phoneNumbers(),
        mapToBaseAddressDto(child.contactAddress()),
        mapToBaseAddressDto(child.differentBillingAddress()));
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
