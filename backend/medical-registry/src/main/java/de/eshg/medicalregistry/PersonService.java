/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry;

import static de.cronn.commons.lang.StreamUtil.toLinkedHashMap;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.ExternalAddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesResponse;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.base.centralfile.api.person.PersonDetails;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.centralfile.api.person.UpdatePersonRequest;
import de.eshg.base.centralfile.api.person.UpdateReferencePersonRequest;
import de.eshg.lib.procedure.MapperHelper;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.medicalregistry.api.CreateApplicantDto;
import de.eshg.medicalregistry.api.CreateEmployeeChangeDto;
import de.eshg.medicalregistry.api.CreateEmployeeChangeRequest;
import de.eshg.medicalregistry.api.CreateProcedureRequest;
import de.eshg.medicalregistry.api.ProfessionalReferencePersonDto;
import de.eshg.medicalregistry.api.ResolvedEmployeeChangeDto;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.model.Person;
import de.eshg.medicalregistry.importer.MedicalRegistryRow;
import de.eshg.medicalregistry.mapper.AddressMapper;
import de.eshg.medicalregistry.mapper.EnrichmentHelper;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class PersonService {

  private static final Logger log = LoggerFactory.getLogger(PersonService.class);
  private final PersonApi personApi;

  public PersonService(PersonApi personApi) {
    this.personApi = personApi;
  }

  List<GetPersonFileStateResponse> findPersonDetails(List<Person> persons) {
    if (CollectionUtils.isEmpty(persons)) {
      return List.of();
    }

    GetPersonFileStatesResponse fileStateDetails =
        personApi.getPersonFileStates(
            new GetPersonFileStatesRequest(
                persons.stream().map(RelatedPerson::getCentralFileStateId).toList()));

    if (fileStateDetails.personFileStates().size() != persons.size()) {
      throw new IllegalStateException("Some facilities were not found in the central file.");
    }

    return fileStateDetails.personFileStates();
  }

  public Map<GetReferencePersonResponse, List<UUID>>
      getPersonFileStateIdsAssociatedWithReferencePersons(List<GetReferencePersonResponse> list) {
    return list.stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                Function.identity(),
                fileStateId ->
                    personApi
                        .getPersonFileStateIdsAssociatedWithReferencePerson(fileStateId.id())
                        .fileStateIds()));
  }

  CreatedPersons createPersonsInCentralFileState(CreateProcedureRequest createProcedureRequest) {
    return new CreatedPersons(
        personApi
            .addPersonFromExternalSource(
                mapToExternalAddPersonFileStateRequest(createProcedureRequest.applicant()))
            .id(),
        getEmployeeChanges(createProcedureRequest).stream()
            .map(this::mapToExternalAddPersonFileStateRequest)
            .map(personApi::addPersonFromExternalSource)
            .map(AddPersonFileStateResponse::id)
            .toList());
  }

  private ExternalAddPersonFileStateRequest mapToExternalAddPersonFileStateRequest(
      CreateApplicantDto applicant) {
    return new ExternalAddPersonFileStateRequest(
        applicant.getTitle(),
        null,
        applicant.getGender(),
        applicant.getFirstName(),
        applicant.getLastName(),
        applicant.getDateOfBirth(),
        applicant.getNameAtBirth(),
        applicant.getPlaceOfBirth(),
        null,
        MapperHelper.toList(applicant.getEmailAddress()),
        MapperHelper.toList(applicant.getPhoneNumber()),
        AddressMapper.mapAddress(applicant.getAddress()),
        null);
  }

  private ExternalAddPersonFileStateRequest mapToExternalAddPersonFileStateRequest(
      CreateEmployeeChangeDto employeeChange) {
    return new ExternalAddPersonFileStateRequest(
        new PersonDetailsDto(
            employeeChange.firstName(), employeeChange.lastName(), employeeChange.dateOfBirth()));
  }

  private List<CreateEmployeeChangeDto> getEmployeeChanges(
      CreateProcedureRequest createProcedureRequest) {
    if (createProcedureRequest instanceof CreateEmployeeChangeRequest createEmployeeChangeRequest) {
      return createEmployeeChangeRequest.employeeChanges();
    } else {
      return List.of();
    }
  }

  public Map<UUID, List<GetReferencePersonResponse>> searchReferencePersons(
      MedicalRegistryProcedure procedure) {
    return searchReferencePersons(
        procedure.getRelatedPersons().stream().map(RelatedPerson::getCentralFileStateId).toList());
  }

  public Map<UUID, List<GetReferencePersonResponse>> searchReferencePersons(
      List<UUID> centralFileStateIds) {
    return personApi
        .getPersonFileStates(new GetPersonFileStatesRequest(centralFileStateIds))
        .personFileStates()
        .stream()
        .collect(toLinkedHashMap(GetPersonFileStateResponse::id, this::searchReferencePerson));
  }

  private List<GetReferencePersonResponse> searchReferencePerson(PersonDetails personDetails) {
    List<GetReferencePersonResponse> matchingReferencePersonsWithLastName =
        personApi
            .searchReferencePersons(
                personDetails.firstName(), personDetails.lastName(), personDetails.dateOfBirth())
            .persons();

    boolean hasDifferentNameAtBirth =
        personDetails.nameAtBirth() != null
            && !personDetails.nameAtBirth().equals(personDetails.lastName());
    if (!hasDifferentNameAtBirth) {
      return matchingReferencePersonsWithLastName;
    }

    List<GetReferencePersonResponse> matchingReferencePersonsWithNameAtBirth =
        personApi
            .searchReferencePersons(
                personDetails.firstName(), personDetails.nameAtBirth(), personDetails.dateOfBirth())
            .persons();

    return Stream.of(matchingReferencePersonsWithNameAtBirth, matchingReferencePersonsWithLastName)
        .flatMap(Collection::stream)
        .toList();
  }

  public List<UUID> createEmployeesInCentralFile(List<ResolvedEmployeeChangeDto> employees) {
    if (employees.isEmpty()) {
      return List.of();
    }

    return personApi
        .addPersonFileStates(
            new AddPersonFileStatesRequest(
                employees.stream().map(this::mapToAddPersonFileStateRequest).toList()))
        .personFileStateIds();
  }

  private AddPersonFileStateRequest mapToAddPersonFileStateRequest(
      ResolvedEmployeeChangeDto employeeChange) {
    return new AddPersonFileStateRequest(
        employeeChange.referencePersonId(),
        new PersonDetailsDto(
            employeeChange.firstName(), employeeChange.lastName(), employeeChange.dateOfBirth()),
        DataOriginDto.MANUAL);
  }

  record CreatedPersons(UUID applicantPersonId, List<UUID> employeeChangePersonIds) {}

  Map<MedicalRegistryRow, UUID> createPersonsInCentralFile(List<MedicalRegistryRow> rows) {
    List<UUID> fileStateIds =
        personApi
            .addPersonFileStates(
                new AddPersonFileStatesRequest(
                    rows.stream()
                        .map(MedicalRegistryRow::getApplicant)
                        .map(
                            professional ->
                                mapToAddPersonFileStateRequest(professional, DataOriginDto.IMPORT))
                        .toList()))
            .personFileStateIds();
    return IntStream.range(0, rows.size())
        .boxed()
        .collect(StreamUtil.toLinkedHashMap(rows::get, fileStateIds::get));
  }

  UUID updateOrConfirmProfessional(
      UUID professionalFileStateId, ProfessionalReferencePersonDto professionalReferencePerson) {
    GetPersonFileStateResponse professionalFileState =
        personApi.getPersonFileState(professionalFileStateId);

    if (professionalReferencePerson != null) {
      return updateReferencePersonWithDraftDetails(
          professionalFileState, professionalReferencePerson);
    } else {
      return confirmPerson(professionalFileState);
    }
  }

  Map<UUID, GetPersonFileStateResponse> resolvePersonDetailsById(
      Iterable<MedicalRegistryProcedure> medicalRegistryEntries) {
    return findPersonDetails(
            StreamSupport.stream(medicalRegistryEntries.spliterator(), false)
                .map(Procedure::getRelatedPersons)
                .flatMap(Collection::stream)
                .toList())
        .stream()
        .collect(StreamUtil.toLinkedHashMap(GetPersonFileStateResponse::id));
  }

  private UUID confirmPerson(GetPersonFileStateResponse personFileState) {
    log.info("Confirming person {} in central file", personFileState);

    return personApi
        .updatePersonFileStateAndReference(
            personFileState.id(), new UpdatePersonRequest(personFileState))
        .id();
  }

  private UUID updateReferencePersonWithDraftDetails(
      GetPersonFileStateResponse draftProfessionalFileState,
      ProfessionalReferencePersonDto professionalReference) {
    log.info(
        "Updating person {} in central file state with draft details", professionalReference.id());

    AddPersonFileStateResponse updatedFileState =
        personApi.updateReferencePerson(
            professionalReference.id(),
            new UpdateReferencePersonRequest(
                enrich(draftProfessionalFileState, professionalReference),
                professionalReference.version()));

    personApi.markPersonFileStateForDeletion(
        new DeleteFileStatesRequest(draftProfessionalFileState.id()));

    return updatedFileState.id();
  }

  private UpdatePersonRequest enrich(
      PersonDetails newPersonDetails, PersonDetails oldPersonDetails) {
    return new UpdatePersonRequest(
        EnrichmentHelper.enrich(PersonDetails::title, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::salutation, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::gender, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::firstName, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::lastName, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::dateOfBirth, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::nameAtBirth, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::placeOfBirth, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::countryOfBirth, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrichList(
            PersonDetails::emailAddresses, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrichList(
            PersonDetails::phoneNumbers, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(PersonDetails::contactAddress, newPersonDetails, oldPersonDetails),
        EnrichmentHelper.enrich(
            PersonDetails::differentBillingAddress, newPersonDetails, oldPersonDetails));
  }

  private static AddPersonFileStateRequest mapToAddPersonFileStateRequest(
      CreateApplicantDto professional, DataOriginDto dataOrigin) {
    return new AddPersonFileStateRequest(
        null,
        professional.getTitle(),
        null,
        professional.getGender(),
        professional.getFirstName(),
        professional.getLastName(),
        professional.getDateOfBirth(),
        professional.getNameAtBirth(),
        professional.getPlaceOfBirth(),
        null,
        MapperHelper.toList(professional.getEmailAddress()),
        MapperHelper.toList(professional.getPhoneNumber()),
        AddressMapper.mapAddress(professional.getAddress()),
        null,
        dataOrigin);
  }
}
