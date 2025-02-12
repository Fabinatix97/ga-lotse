/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.base.centralfile.api.person.*;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PersonAddressDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PersonSyncDto;
import jakarta.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
public class PersonClient {
  private static final Logger log = LoggerFactory.getLogger(PersonClient.class);

  private final PersonApi personApi;

  public PersonClient(PersonApi personApi) {
    this.personApi = personApi;
  }

  public record PatientSync(@Valid PatientDto patient, @Valid PersonSyncDto personSync) {}

  public UUID createPersonInCentralFile(PatientDto patient) {
    AddPersonFileStateRequest addPersonRequest =
        new AddPersonFileStateRequest(
            null,
            StringUtils.trimToNull(patient.title()),
            patient.salutation(),
            patient.gender(),
            patient.firstName().trim(),
            patient.lastName().trim(),
            patient.dateOfBirth(),
            StringUtils.trimToNull(patient.nameAtBirth()),
            StringUtils.trimToNull(patient.placeOfBirth()),
            patient.countryOfBirth(),
            patient.emailAddresses(),
            patient.phoneNumbers(),
            mapAddressToPersonApiType(patient.address()),
            null,
            DataOriginDto.MANUAL);

    log.info("Creating person in the central file");

    AddPersonFileStateResponse personDtoResponseEntity =
        personApi.addPersonFileState(addPersonRequest);

    log.info("Created person in the central file with ID={}", personDtoResponseEntity.id());

    return personDtoResponseEntity.id();
  }

  public UUID createPersonFromExternalSource(PatientDto patient) {
    ExternalAddPersonFileStateRequest request =
        new ExternalAddPersonFileStateRequest(
            StringUtils.trimToNull(patient.title()),
            patient.salutation(),
            patient.gender(),
            patient.firstName().trim(),
            patient.lastName().trim(),
            patient.dateOfBirth(),
            StringUtils.trimToNull(patient.nameAtBirth()),
            StringUtils.trimToNull(patient.placeOfBirth()),
            patient.countryOfBirth(),
            patient.emailAddresses(),
            patient.phoneNumbers(),
            mapAddressToPersonApiType(patient.address()),
            null);
    AddPersonFileStateResponse personFromExternalSource =
        personApi.addPersonFromExternalSource(request);
    return personFromExternalSource.id();
  }

  public UUID syncPerson(UUID fileStateId, long referenceVersion) {
    try {
      AddPersonFileStateResponse response =
          personApi.syncFileState(fileStateId, new SyncFileStateRequest(referenceVersion));
      return response.id();
    } catch (HttpClientErrorException.BadRequest e) {
      ErrorResponse body = e.getResponseBodyAs(ErrorResponse.class);
      if (body != null && ErrorCode.CONFLICT.equals(body.errorCode())) {
        throw new BadRequestException(
            ErrorCode.CONFLICT, "Conflict in central file: %s".formatted(body.message()));
      }
      throw e;
    }
  }

  public UUID updatePersonInCentralFile(UUID fileStateId, PatientDto patient) {
    GetPersonFileStatesResponse getPersonFileStatesResponse =
        personApi.getPersonFileStates(new GetPersonFileStatesRequest(List.of(fileStateId)));

    GetPersonFileStateResponse personFileStateResponse =
        getPersonFileStatesResponse.personFileStates().getFirst();
    AddressDto billingAddress = personFileStateResponse.differentBillingAddress();

    UpdatePersonRequest updatePersonRequest = createUpdatePersonRequest(patient, billingAddress);

    AddPersonFileStateResponse addPersonFileStateResponse =
        personApi.updatePersonFileStateAndReference(fileStateId, updatePersonRequest);
    return addPersonFileStateResponse.id();
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
            .findFirst()
            .orElseThrow(() -> new BadRequestException("Reference person not found."));
    boolean dataAdded =
        addEmailAndPhoneNumberToReferencePerson(referencePerson, personFromCentralFile);
    UpdatePersonRequest updatePersonRequest = mapToUpdatePersonRequest(referencePerson);
    AddPersonFileStateResponse addPersonFileStateResponse;
    if (dataAdded) {
      UpdateReferencePersonRequest updateReferencePersonRequest =
          new UpdateReferencePersonRequest(updatePersonRequest, referencePerson.version());
      addPersonFileStateResponse =
          personApi.updateReferencePerson(referencePersonId, updateReferencePersonRequest);
    } else {
      AddPersonFileStateRequest addPersonRequest = mapToAddPersonRequest(referencePerson);
      addPersonFileStateResponse = personApi.addPersonFileState(addPersonRequest);
    }

    return addPersonFileStateResponse.id();
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
      String normalizedNumber = normalizePhoneNumber(phoneNumber);
      if (!referenceNumbers.contains(normalizedNumber)) {
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

  public PatientSync getPersonFromCentralFile(UUID id) {
    GetPersonFileStateResponse personFromCentralFile = personApi.getPersonFileState(id);
    return mapToPatientStatusDto(personFromCentralFile);
  }

  public PatientDto getPatientFromCentralFile(UUID id) {
    return getPersonFromCentralFile(id).patient();
  }

  public Map<UUID, PatientDto> getPersonsFromCentralFile(List<UUID> ids) {
    if (ids.isEmpty()) {
      return Map.of();
    }

    GetPersonFileStatesResponse response =
        personApi.getPersonFileStates(new GetPersonFileStatesRequest(ids));
    List<GetPersonFileStateResponse> personFileStates = response.personFileStates();
    if (personFileStates.size() != ids.size()) {
      throw new IllegalStateException("Some patients could not be found in the central file.");
    }

    return personFileStates.stream()
        .collect(Collectors.toMap(GetPersonFileStateResponse::id, PersonClient::mapToPatientDto));
  }

  public void markExternalPersonForDeletion(UUID fileStateId) {
    DeleteFileStatesRequest deleteFileStatesRequest = new DeleteFileStatesRequest(fileStateId);
    personApi.markPersonFileStateForDeletion(deleteFileStatesRequest);
  }

  private UpdatePersonRequest createUpdatePersonRequest(
      PatientDto patient, AddressDto billingAddress) {
    return new UpdatePersonRequest(
        new PersonDetailsDto(
            StringUtils.trimToNull(patient.title()),
            patient.salutation(),
            patient.gender(),
            patient.firstName().trim(),
            patient.lastName().trim(),
            patient.dateOfBirth(),
            StringUtils.trimToNull(patient.nameAtBirth()),
            StringUtils.trimToNull(patient.placeOfBirth()),
            patient.countryOfBirth(),
            patient.emailAddresses(),
            patient.phoneNumbers(),
            mapAddressToPersonApiType(patient.address()),
            billingAddress));
  }

  private static PatientSync mapToPatientStatusDto(
      GetPersonFileStateResponse getPersonFileStateResponse) {
    return new PatientSync(
        new PatientDto(
            getPersonFileStateResponse.salutation(),
            getPersonFileStateResponse.firstName(),
            getPersonFileStateResponse.lastName(),
            getPersonFileStateResponse.dateOfBirth(),
            getPersonFileStateResponse.emailAddresses(),
            getPersonFileStateResponse.phoneNumbers(),
            getPersonFileStateResponse.countryOfBirth(),
            getPersonFileStateResponse.nameAtBirth(),
            getPersonFileStateResponse.placeOfBirth(),
            getPersonFileStateResponse.title(),
            getPersonFileStateResponse.gender(),
            mapAddressToPerson(getPersonFileStateResponse.contactAddress())),
        new PersonSyncDto(
            getPersonFileStateResponse.id(),
            getPersonFileStateResponse.referenceVersion(),
            getPersonFileStateResponse.outdated()));
  }

  private static PatientDto mapToPatientDto(GetPersonFileStateResponse getPersonFileStateResponse) {
    return new PatientDto(
        getPersonFileStateResponse.salutation(),
        getPersonFileStateResponse.firstName(),
        getPersonFileStateResponse.lastName(),
        getPersonFileStateResponse.dateOfBirth(),
        getPersonFileStateResponse.emailAddresses(),
        getPersonFileStateResponse.phoneNumbers(),
        getPersonFileStateResponse.countryOfBirth(),
        getPersonFileStateResponse.nameAtBirth(),
        getPersonFileStateResponse.placeOfBirth(),
        getPersonFileStateResponse.title(),
        getPersonFileStateResponse.gender(),
        mapAddressToPerson(getPersonFileStateResponse.contactAddress()));
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

  private static PersonAddressDto mapAddressToPerson(de.eshg.base.address.AddressDto address) {
    if (address == null) {
      return null;
    }
    if (address instanceof DomesticAddressDto domesticAddressDto) {
      return toPersonAddressDto(domesticAddressDto);
    }
    throw new IllegalArgumentException("Unexpected instance of Address");
  }

  private static PersonAddressDto toPersonAddressDto(
      de.eshg.base.address.DomesticAddressDto addressDto) {
    return new PersonAddressDto(
        addressDto.country(),
        addressDto.city(),
        addressDto.postalCode(),
        addressDto.street(),
        addressDto.houseNumber(),
        addressDto.addressAddition());
  }

  private static DomesticAddressDto mapAddressToPersonApiType(PersonAddressDto address) {
    if (address == null || address.street().isBlank()) {
      return null;
    }
    return new DomesticAddressDto(
        address.country(),
        StringUtils.trimToNull(address.city()),
        StringUtils.trimToNull(address.postalCode()),
        null,
        StringUtils.trimToNull(address.street()),
        StringUtils.trimToNull(address.houseNumber()),
        StringUtils.trimToNull(address.addressAddition()));
  }
}
