/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonWithoutDateOfBirthRequest;
import de.eshg.base.centralfile.api.person.ExternalAddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.GetPersonWithoutDateOfBirthResponse;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.centralfile.api.person.UpdatePersonRequest;
import de.eshg.base.centralfile.api.person.UpdatePersonWithoutDateOfBirthRequest;
import de.eshg.measlesprotection.api.draft.AffectedPersonDetailsDto;
import de.eshg.measlesprotection.api.draft.CustodianDetailsDto;
import de.eshg.measlesprotection.api.draft.CustodianWithoutDateOfBirthDetailsDto;

public class AffectedPersonDetailsMapper {
  private AffectedPersonDetailsMapper() {}

  public static AddPersonFileStateRequest getAddPersonRequest(CustodianDetailsDto custodian) {
    return new AddPersonFileStateRequest(
        null,
        custodian.title(),
        custodian.salutation(),
        custodian.gender(),
        custodian.firstName(),
        custodian.lastName(),
        custodian.dateOfBirth(),
        custodian.nameAtBirth(),
        custodian.placeOfBirth(),
        custodian.countryOfBirth(),
        custodian.emailAddresses(),
        custodian.phoneNumbers(),
        custodian.address(),
        null,
        DataOriginDto.MANUAL);
  }

  public static AddPersonWithoutDateOfBirthRequest getAddPersonWithoutDateOfBirthRequest(
      CustodianWithoutDateOfBirthDetailsDto custodian) {
    return new AddPersonWithoutDateOfBirthRequest(
        custodian.title(),
        custodian.salutation(),
        custodian.gender(),
        custodian.firstName(),
        custodian.lastName(),
        custodian.emailAddresses(),
        custodian.phoneNumbers(),
        custodian.address(),
        DataOriginDto.MANUAL);
  }

  public static ExternalAddPersonFileStateRequest getExternalAddPersonRequest(
      CustodianDetailsDto custodian) {
    return new ExternalAddPersonFileStateRequest(
        custodian.title(),
        custodian.salutation(),
        custodian.gender(),
        custodian.firstName(),
        custodian.lastName(),
        custodian.dateOfBirth(),
        custodian.nameAtBirth(),
        custodian.placeOfBirth(),
        custodian.countryOfBirth(),
        custodian.emailAddresses(),
        custodian.phoneNumbers(),
        custodian.address(),
        null);
  }

  public static AddPersonFileStateRequest getAddPersonRequest(AffectedPersonDetailsDto person) {
    return new AddPersonFileStateRequest(
        null,
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
        person.address(),
        null,
        DataOriginDto.MANUAL);
  }

  public static ExternalAddPersonFileStateRequest getExternalAddPersonRequest(
      AffectedPersonDetailsDto person) {
    return new ExternalAddPersonFileStateRequest(
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
        person.address(),
        null);
  }

  public static UpdatePersonRequest getUpdatePersonRequest(AffectedPersonDetailsDto personDetails) {
    if (personDetails == null) {
      return null;
    }
    return new UpdatePersonRequest(getPersonDetailsDto(personDetails));
  }

  public static UpdatePersonRequest getUpdatePersonRequest(CustodianDetailsDto personDetails) {
    if (personDetails == null) {
      return null;
    }
    return new UpdatePersonRequest(getPersonDetailsDto(personDetails));
  }

  public static PersonDetailsDto getPersonDetailsDto(AffectedPersonDetailsDto personDetails) {
    return new PersonDetailsDto(
        personDetails.title(),
        personDetails.salutation(),
        personDetails.gender(),
        personDetails.firstName(),
        personDetails.lastName(),
        personDetails.dateOfBirth(),
        personDetails.nameAtBirth(),
        personDetails.placeOfBirth(),
        personDetails.countryOfBirth(),
        personDetails.emailAddresses(),
        personDetails.phoneNumbers(),
        personDetails.address(),
        null);
  }

  public static PersonDetailsDto getPersonDetailsDto(CustodianDetailsDto personDetails) {
    return new PersonDetailsDto(
        personDetails.title(),
        personDetails.salutation(),
        personDetails.gender(),
        personDetails.firstName(),
        personDetails.lastName(),
        personDetails.dateOfBirth(),
        personDetails.nameAtBirth(),
        personDetails.placeOfBirth(),
        personDetails.countryOfBirth(),
        personDetails.emailAddresses(),
        personDetails.phoneNumbers(),
        personDetails.address(),
        null);
  }

  public static UpdatePersonWithoutDateOfBirthRequest mapToUpdatePersonWithoutDateOfBirthRequest(
      CustodianWithoutDateOfBirthDetailsDto custodianDetailsData) {
    return new UpdatePersonWithoutDateOfBirthRequest(
        custodianDetailsData.title(),
        custodianDetailsData.salutation(),
        custodianDetailsData.gender(),
        custodianDetailsData.firstName(),
        custodianDetailsData.lastName(),
        custodianDetailsData.emailAddresses(),
        custodianDetailsData.phoneNumbers(),
        custodianDetailsData.address());
  }

  public static CustodianWithoutDateOfBirthDetailsDto mapToCustodianWithoutDateOfBirthDetailsDto(
      GetPersonWithoutDateOfBirthResponse response) {
    return new CustodianWithoutDateOfBirthDetailsDto(
        response.firstName(),
        response.lastName(),
        response.phoneNumbers(),
        response.emailAddresses(),
        response.gender(),
        response.salutation(),
        response.title(),
        response.contactAddress());
  }
}
