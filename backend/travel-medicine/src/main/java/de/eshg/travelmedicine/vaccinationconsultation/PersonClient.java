/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.ExternalAddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.GetPersonDiffResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.centralfile.api.person.PutPersonRequest;
import de.eshg.base.centralfile.api.person.SyncFileStateRequest;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import de.eshg.travelmedicine.vaccinationconsultation.api.PatientDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PersonAddressDto;
import de.eshg.travelmedicine.vaccinationconsultation.api.PersonSyncDto;
import jakarta.validation.Valid;
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

  public UUID updatePersonInCentralFile(UUID id, PatientDto patient) {
    GetPersonFileStatesResponse getPersonFileStatesResponse =
        personApi.getPersonFileStates(new GetPersonFileStatesRequest(List.of(id)));

    AddPersonFileStateResponse personFileStateResponse =
        getPersonFileStatesResponse.personFileStates().getFirst();
    AddressDto billingAddress = personFileStateResponse.differentBillingAddress();

    PutPersonRequest putPersonRequest = createPutPersonRequest(patient, billingAddress);

    AddPersonFileStateResponse addPersonFileStateResponse =
        personApi.updatePersonFileStateAndReference(id, putPersonRequest);
    return addPersonFileStateResponse.id();
  }

  public PatientSync getPersonFromCentralFile(UUID id) {
    GetPersonFileStateResponse personFromCentralFile = personApi.getPersonFileState(id);
    return mapToPatientStatusDto(personFromCentralFile);
  }

  public Map<UUID, PatientDto> getPersonsFromCentralFile(List<UUID> ids) {
    if (ids.isEmpty()) {
      return Map.of();
    }

    GetPersonFileStatesResponse response =
        personApi.getPersonFileStates(new GetPersonFileStatesRequest(ids));
    List<AddPersonFileStateResponse> personFileStates = response.personFileStates();
    if (personFileStates.size() != ids.size()) {
      throw new IllegalStateException("Some patients could not be found in the central file.");
    }

    return personFileStates.stream()
        .collect(Collectors.toMap(AddPersonFileStateResponse::id, PersonClient::mapToPatientDto));
  }

  public long getPersonReferenceVersion(UUID fileStateId) {
    GetPersonDiffResponse personDiff = personApi.getPersonDiff(fileStateId);
    return personDiff.referenceVersion();
  }

  private PutPersonRequest createPutPersonRequest(PatientDto patient, AddressDto billingAddress) {
    return new PutPersonRequest(
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

  private static PatientDto mapToPatientDto(AddPersonFileStateResponse addPersonFileStateResponse) {
    return new PatientDto(
        addPersonFileStateResponse.salutation(),
        addPersonFileStateResponse.firstName(),
        addPersonFileStateResponse.lastName(),
        addPersonFileStateResponse.dateOfBirth(),
        addPersonFileStateResponse.emailAddresses(),
        addPersonFileStateResponse.phoneNumbers(),
        addPersonFileStateResponse.countryOfBirth(),
        addPersonFileStateResponse.nameAtBirth(),
        addPersonFileStateResponse.placeOfBirth(),
        addPersonFileStateResponse.title(),
        addPersonFileStateResponse.gender(),
        mapAddressToPerson(addPersonFileStateResponse.contactAddress()));
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
