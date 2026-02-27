/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing;

import static de.eshg.infectionbriefing.mapper.SalutationMapper.mapToBaseSalutationDto;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.ExternalAddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.centralfile.api.person.SearchReferencePersonsResponse;
import de.eshg.base.centralfile.api.person.UpdatePersonRequest;
import de.eshg.base.centralfile.api.person.UpdateReferencePersonRequest;
import de.eshg.infectionbriefing.api.ApplicantAddressDto;
import de.eshg.infectionbriefing.api.PersonDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.rest.service.error.BadRequestException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class PersonClient {

  private final PersonApi personApi;

  public PersonClient(PersonApi personApi) {
    this.personApi = personApi;
  }

  public UUID createPerson(PersonDto applicant) {
    return createPerson(applicant, null);
  }

  public UUID createPerson(PersonDto applicant, ApplicantAddressDto address) {
    return personApi
        .addPersonFromExternalSource(
            new ExternalAddPersonFileStateRequest(
                null,
                mapToBaseSalutationDto(applicant.salutation()),
                null,
                applicant.firstName().trim(),
                applicant.lastName().trim(),
                applicant.dateOfBirth(),
                null,
                null,
                null,
                List.of(applicant.email()),
                Optional.ofNullable(applicant.phone()).map(List::of).orElse(null),
                Optional.ofNullable(address).map(this::mapToBaseAddress).orElse(null),
                null))
        .id();
  }

  private AddressDto mapToBaseAddress(ApplicantAddressDto address) {
    return new DomesticAddressDto(
        CountryCode.DE,
        address.city(),
        address.postalCode(),
        address.street(),
        address.houseNumber());
  }

  public UUID createInternalReferencePerson(UUID fileStateId) {

    GetPersonFileStateResponse personFromCentralFile = personApi.getPersonFileState(fileStateId);

    UpdatePersonRequest updatePersonRequest = mapToUpdatePersonRequest(personFromCentralFile);

    AddPersonFileStateResponse addPersonFileStateResponse =
        personApi.updatePersonFileStateAndReference(fileStateId, updatePersonRequest);
    return addPersonFileStateResponse.id();
  }

  public UUID updatePersonAndCreateFileState(UUID referencePersonId, UUID oldFileStateId) {
    GetPersonFileStateResponse personFromCentralFile = personApi.getPersonFileState(oldFileStateId);
    SearchReferencePersonsResponse searchReferencePersons =
        personApi.searchReferencePersons(
            personFromCentralFile.firstName(),
            personFromCentralFile.lastName(),
            personFromCentralFile.dateOfBirth());
    GetReferencePersonResponse referencePerson =
        searchReferencePersons.persons().stream()
            .filter(p -> p.id().equals(referencePersonId))
            .collect(StreamUtil.toSingleOptionalElement())
            .orElseThrow(() -> new BadRequestException("Reference person not found."));
    boolean dataAdded =
        addEmailAndPhoneNumberToReferencePerson(referencePerson, personFromCentralFile);
    if (dataAdded) {
      return personApi
          .updateReferencePerson(
              referencePersonId,
              new UpdateReferencePersonRequest(
                  mapToUpdatePersonRequest(referencePerson), referencePerson.version()))
          .id();
    } else {
      return personApi.addPersonFileState(mapToAddPersonRequest(referencePerson)).id();
    }
  }

  public List<GetPersonFileStateResponse> getPersonFileStates(List<UUID> fileStateIds) {
    return personApi
        .getPersonFileStates(new GetPersonFileStatesRequest(fileStateIds))
        .personFileStates();
  }

  public GetPersonFileStateResponse getPersonFileState(UUID fileStateId) {
    return personApi.getPersonFileState(fileStateId);
  }

  private AddPersonFileStateRequest mapToAddPersonRequest(
      GetReferencePersonResponse referencePerson) {
    return new AddPersonFileStateRequest(
        referencePerson.id(),
        referencePerson.title(),
        referencePerson.salutation(),
        referencePerson.gender(),
        referencePerson.firstName().trim(),
        referencePerson.lastName().trim(),
        referencePerson.dateOfBirth(),
        referencePerson.nameAtBirth(),
        referencePerson.placeOfBirth(),
        referencePerson.countryOfBirth(),
        referencePerson.emailAddresses(),
        referencePerson.phoneNumbers(),
        referencePerson.contactAddress(),
        referencePerson.differentBillingAddress(),
        DataOriginDto.MANUAL);
  }

  private boolean addEmailAndPhoneNumberToReferencePerson(
      GetReferencePersonResponse referencePerson,
      GetPersonFileStateResponse personFromCentralFile) {
    boolean mailAdded =
        addEmailsToReferencePerson(referencePerson, personFromCentralFile.emailAddresses());
    boolean phoneNumberAdded =
        addPhoneNumbersToReferencePerson(referencePerson, personFromCentralFile.phoneNumbers());
    return (mailAdded || phoneNumberAdded);
  }

  private boolean addPhoneNumbersToReferencePerson(
      GetReferencePersonResponse referencePerson, List<String> phoneNumbers) {
    boolean phoneNumberAdded = false;
    HashSet<String> referenceNumbers =
        referencePerson.phoneNumbers().stream()
            .map(this::normalizePhoneNumber)
            .collect(Collectors.toCollection(HashSet::new));

    for (String phoneNumber : phoneNumbers) {
      if (!referenceNumbers.contains(normalizePhoneNumber(phoneNumber))) {
        referencePerson.phoneNumbers().add(phoneNumber);
        phoneNumberAdded = true;
      }
    }
    return phoneNumberAdded;
  }

  private String normalizePhoneNumber(String phoneNumber) {
    phoneNumber = phoneNumber.replaceAll("[^\\d.]", "");
    if (phoneNumber.startsWith("00")) {
      phoneNumber = phoneNumber.substring(2);
    }
    return phoneNumber;
  }

  private boolean addEmailsToReferencePerson(
      GetReferencePersonResponse referencePerson, List<String> emails) {
    boolean mailsAdded = false;
    for (String email : emails) {
      if (!referencePerson.emailAddresses().contains(email)) {
        referencePerson.emailAddresses().add(email);
        mailsAdded = true;
      }
    }
    return mailsAdded;
  }

  private UpdatePersonRequest mapToUpdatePersonRequest(
      GetPersonFileStateResponse personFromCentralFile) {
    return new UpdatePersonRequest(mapToPersonDetailsDto(personFromCentralFile));
  }

  private PersonDetailsDto mapToPersonDetailsDto(GetPersonFileStateResponse personFromCentralFile) {
    return new PersonDetailsDto(
        personFromCentralFile.title(),
        personFromCentralFile.salutation(),
        personFromCentralFile.gender(),
        personFromCentralFile.firstName().trim(),
        personFromCentralFile.lastName().trim(),
        personFromCentralFile.dateOfBirth(),
        personFromCentralFile.nameAtBirth(),
        personFromCentralFile.placeOfBirth(),
        personFromCentralFile.countryOfBirth(),
        personFromCentralFile.emailAddresses(),
        personFromCentralFile.phoneNumbers(),
        personFromCentralFile.contactAddress(),
        personFromCentralFile.differentBillingAddress());
  }

  private UpdatePersonRequest mapToUpdatePersonRequest(GetReferencePersonResponse referencePerson) {
    return new UpdatePersonRequest(
        referencePerson.title(),
        referencePerson.salutation(),
        referencePerson.gender(),
        referencePerson.firstName().trim(),
        referencePerson.lastName().trim(),
        referencePerson.dateOfBirth(),
        referencePerson.nameAtBirth(),
        referencePerson.placeOfBirth(),
        referencePerson.countryOfBirth(),
        referencePerson.emailAddresses(),
        referencePerson.phoneNumbers(),
        referencePerson.contactAddress(),
        referencePerson.differentBillingAddress());
  }
}
