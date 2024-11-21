/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import static de.eshg.lib.procedure.MapperHelper.mapEnumSet;
import static de.eshg.lib.procedure.domain.model.Procedure_.CREATED_AT;
import static de.eshg.lib.procedure.domain.model.Procedure_.PROCEDURE_STATUS;
import static de.eshg.lib.procedure.domain.model.Procedure_.procedureStatus;
import static de.eshg.lib.procedure.domain.model.Procedure_.relatedPersons;
import static de.eshg.medicalregistry.Validator.asMapper;
import static de.eshg.medicalregistry.domain.model.MedicalRegistryEntry_.requestForWrittenConfirmation;
import static de.eshg.medicalregistry.domain.model.Professional_.professionalTitle;
import static de.eshg.medicalregistry.mapper.ProcedureMapper.mapToDomain;
import static de.eshg.medicalregistry.mapper.ProcedureMapper.mapToSystemProgressEntryType;
import static de.eshg.medicalregistry.mapper.ProfessionalMapper.mapToDomain;
import static java.util.Optional.ofNullable;
import static org.springframework.data.domain.PageRequest.ofSize;
import static org.springframework.data.jpa.domain.Specification.allOf;
import static org.springframework.data.jpa.domain.Specification.where;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.centralfile.FacilityApi;
import de.eshg.base.centralfile.PersonApi;
import de.eshg.base.centralfile.api.DeleteFileStatesRequest;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.ExternalAddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.FacilityContactPersonDto;
import de.eshg.base.centralfile.api.facility.FacilityDetails;
import de.eshg.base.centralfile.api.facility.FacilityDetailsDto;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.PutFacilityRequest;
import de.eshg.base.centralfile.api.facility.UpdateReferenceFacilityRequest;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.ExternalAddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.centralfile.api.person.PersonDetails;
import de.eshg.base.centralfile.api.person.PersonDetailsDto;
import de.eshg.base.centralfile.api.person.UpdatePersonRequest;
import de.eshg.base.centralfile.api.person.UpdateReferencePersonRequest;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.ImageMetaData;
import de.eshg.lib.procedure.domain.model.ProcedureFileType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.file.FileFactory;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.lib.procedure.model.GetProceduresPaginationOptions;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.medicalregistry.api.CreatePracticeDto;
import de.eshg.medicalregistry.api.CreateProcedureRequest;
import de.eshg.medicalregistry.api.CreateProfessionalDto;
import de.eshg.medicalregistry.api.GetMedicalRegistryEntryOverview;
import de.eshg.medicalregistry.api.GetMedicalRegistryProceduresFilterOptions;
import de.eshg.medicalregistry.api.MedicalRegistryEntryDto;
import de.eshg.medicalregistry.api.PracticeAddressDto;
import de.eshg.medicalregistry.api.PracticeReferenceFacilityDto;
import de.eshg.medicalregistry.api.ProfessionalAddressDto;
import de.eshg.medicalregistry.api.ProfessionalReferencePersonDto;
import de.eshg.medicalregistry.business.model.DocumentData;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistrySystemProgressEntryType;
import de.eshg.medicalregistry.domain.model.Practice;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.medicalregistry.domain.model.ProfessionalTitle;
import de.eshg.medicalregistry.domain.model.TypeOfChange;
import de.eshg.medicalregistry.domain.registry.MedicalRegistryEntryRepository;
import de.eshg.medicalregistry.mapper.EntryMapper;
import de.eshg.medicalregistry.mapper.ProfessionalMapper;
import de.eshg.validation.ValidationUtil;
import jakarta.persistence.criteria.ListJoin;
import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class MedicalRegistryService {

  private static final EnumSet<TypeOfChange> CLOSING_TYPE_OF_CHANGES =
      EnumSet.of(TypeOfChange.RELOCATION, TypeOfChange.DEREGISTRATION);

  private static final Logger log = LoggerFactory.getLogger(MedicalRegistryService.class);

  private final MedicalRegistryEntryRepository medicalRegistryEntryRepository;
  private final ProcedureDeletionService<MedicalRegistryEntry> procedureDeletionService;
  private final PersonApi personApi;
  private final FacilityApi facilityApi;
  private final AuditLogger auditLogger;
  private final Clock clock;

  public MedicalRegistryService(
      MedicalRegistryEntryRepository medicalRegistryEntryRepository,
      ProcedureDeletionService<MedicalRegistryEntry> procedureDeletionService,
      PersonApi personApi,
      FacilityApi facilityApi,
      AuditLogger auditLogger,
      Clock clock) {
    this.medicalRegistryEntryRepository = medicalRegistryEntryRepository;
    this.procedureDeletionService = procedureDeletionService;
    this.personApi = personApi;
    this.facilityApi = facilityApi;
    this.auditLogger = auditLogger;
    this.clock = clock;
  }

  public Optional<MedicalRegistryEntry> findProcedureByExternalId(UUID procedureId) {
    return medicalRegistryEntryRepository.findByExternalId(procedureId);
  }

  public Optional<MedicalRegistryEntry> findProcedureByExternalIdForUpdate(
      UUID procedureId, long version) {
    return medicalRegistryEntryRepository
        .findByExternalIdForUpdate(procedureId)
        .map(asMapper(entry -> ValidationUtil.validateVersion(version, entry)));
  }

  public GetPersonFileStateResponse findProfessionalDetails(UUID externalId) {
    return personApi.getPersonFileState(externalId);
  }

  public GetFacilityFileStateResponse findPracticeDetails(UUID externalId) {
    return facilityApi.getFacilityFileState(externalId);
  }

  public MedicalRegistryEntryChange createProcedure(
      CreateProcedureRequest request,
      List<DocumentData> documents,
      TriggerType triggerType,
      ProcedureType procedureType)
      throws IOException {
    MedicalRegistryEntryChange medicalRegistryEntry = new MedicalRegistryEntryChange(triggerType);
    medicalRegistryEntry.setTypeOfChange(mapToDomain(request.typeOfChange()));
    medicalRegistryEntry.setConsentToPrivacyPolicy(request.consentToPrivacyPolicy());
    medicalRegistryEntry.setEmployeesEmployed(request.employeesEmployed());
    medicalRegistryEntry.setRequestForWrittenConfirmation(request.requestForWrittenConfirmation());
    medicalRegistryEntry.setProcedureType(procedureType);
    medicalRegistryEntry.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);

    CreateProfessionalDto professional = request.professional();
    UUID personId = createPersonInCentralFile(professional);
    medicalRegistryEntry.addRelatedPerson(buildProfessional(professional, personId));

    CreatePracticeDto practice = request.practice();
    if (practice != null) {
      UUID facilityId = createFacilityInCentralFile(practice, professional);
      medicalRegistryEntry.addRelatedFacility(buildPractice(practice, facilityId));
    }

    addSystemProgressEntry(medicalRegistryEntry, triggerType);
    addSystemProgressEntryAboutRequestForWrittenConfirmationIfNecessary(
        medicalRegistryEntry, triggerType);

    for (DocumentData document : documents) {
      addSystemProgressEntryFile(medicalRegistryEntry, document, triggerType);
    }

    return medicalRegistryEntryRepository.save(medicalRegistryEntry);
  }

  public MedicalRegistryEntry confirmProcedure(
      MedicalRegistryEntryChange draftMedicalRegistryEntry,
      ProfessionalReferencePersonDto professionalReferencePerson,
      PracticeReferenceFacilityDto practiceReferenceFacility,
      MedicalRegistryEntry mergeTarget) {
    log.info(
        "Confirming draft medical registry entry {}", draftMedicalRegistryEntry.getExternalId());

    MedicalRegistryEntry medicalRegistryEntry =
        Optional.ofNullable(mergeTarget)
            .orElseGet(() -> createMedicalRegistryEntryFromDraft(draftMedicalRegistryEntry));

    copyValuesFromDraft(draftMedicalRegistryEntry, medicalRegistryEntry);

    updateOrConfirmProfessional(
        draftMedicalRegistryEntry.getProfessional(),
        medicalRegistryEntry,
        professionalReferencePerson);

    updateOrConfirmPractice(
        draftMedicalRegistryEntry.getRelatedFacilities(),
        medicalRegistryEntry,
        practiceReferenceFacility);

    if (mergeTarget == null) {
      medicalRegistryEntryRepository.save(medicalRegistryEntry);
    }

    log.info("Deleting draft medical registry entry {}", draftMedicalRegistryEntry.getExternalId());
    procedureDeletionService.deleteAndWriteToCemetery(draftMedicalRegistryEntry);

    return medicalRegistryEntry;
  }

  private void updateOrConfirmProfessional(
      Professional sourceProfessional,
      MedicalRegistryEntry targetEntry,
      ProfessionalReferencePersonDto professionalReferencePerson) {
    Professional targetProfessional =
        targetEntry.getRelatedPersons().stream()
            .collect(StreamUtil.toSingleOptionalElement())
            .orElseGet(() -> addProfessionalToEntry(sourceProfessional, targetEntry));

    updateOrConfirmProfessional(
        sourceProfessional, targetProfessional, professionalReferencePerson);
  }

  private void updateOrConfirmProfessional(
      Professional sourceProfessional,
      Professional targetProfessional,
      ProfessionalReferencePersonDto professionalReferencePerson) {
    targetProfessional.setProfessionalTitle(sourceProfessional.getProfessionalTitle());
    targetProfessional.setNationality(sourceProfessional.getNationality());
    targetProfessional.setFieldOfExpertise(sourceProfessional.getFieldOfExpertise());
    targetProfessional.setSpecialistTitle(sourceProfessional.getSpecialistTitle());
    targetProfessional.setFurtherTraining(sourceProfessional.getFurtherTraining());
    targetProfessional.setQualifications(sourceProfessional.getQualifications());
    targetProfessional.setLifetimeDoctorNumber(sourceProfessional.getLifetimeDoctorNumber());
    targetProfessional.setApprobationGrantedOn(sourceProfessional.getApprobationGrantedOn());
    targetProfessional.setApprobationIssuingAuthority(
        sourceProfessional.getApprobationIssuingAuthority());
    targetProfessional.setEmploymentType(sourceProfessional.getEmploymentType());
    targetProfessional.setEmploymentStatus(sourceProfessional.getEmploymentStatus());

    targetProfessional.setCentralFileStateId(
        updateOrConfirmProfessional(
            sourceProfessional.getCentralFileStateId(), professionalReferencePerson));
  }

  private Professional addProfessionalToEntry(
      Professional professional, MedicalRegistryEntry entry) {
    entry.addRelatedPerson(professional);
    return professional;
  }

  private UUID updateOrConfirmProfessional(
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

  private void updateOrConfirmPractice(
      List<Practice> sourcePractices,
      MedicalRegistryEntry targetEntry,
      PracticeReferenceFacilityDto practiceReferenceFacility) {
    sourcePractices.stream()
        .collect(StreamUtil.toSingleOptionalElement())
        .ifPresent(
            sourcePractice ->
                updateOrConfirmPractice(sourcePractice, targetEntry, practiceReferenceFacility));
  }

  private void updateOrConfirmPractice(
      Practice sourcePractice,
      MedicalRegistryEntry targetEntry,
      PracticeReferenceFacilityDto practiceReferenceFacility) {
    Practice targetPractice =
        findTargetPractice(targetEntry.getRelatedFacilities(), practiceReferenceFacility)
            .orElseGet(() -> addPracticeToEntry(sourcePractice, targetEntry));

    updateOrConfirmPractice(sourcePractice, targetPractice, practiceReferenceFacility);
  }

  private Practice addPracticeToEntry(Practice practice, MedicalRegistryEntry target) {
    target.addRelatedFacility(practice);
    return practice;
  }

  private void updateOrConfirmPractice(
      Practice sourcePractice,
      Practice targetPractice,
      PracticeReferenceFacilityDto practiceReferenceFacility) {
    targetPractice.setWebsite(sourcePractice.getWebsite());
    targetPractice.setInstitutionIdentifier(sourcePractice.getInstitutionIdentifier());
    targetPractice.setEstablishmentNumber(sourcePractice.getEstablishmentNumber());
    targetPractice.setHealthInsuranceAuthorization(sourcePractice.isHealthInsuranceAuthorization());
    targetPractice.setOpeningHours(sourcePractice.getOpeningHours());

    targetPractice.setCentralFileStateId(
        updateOrConfirmPractice(sourcePractice.getCentralFileStateId(), practiceReferenceFacility));
  }

  private UUID updateOrConfirmPractice(
      UUID centralFileStateId, PracticeReferenceFacilityDto practiceReferenceFacility) {
    GetFacilityFileStateResponse facilityFileState =
        facilityApi.getFacilityFileState(centralFileStateId);

    if (practiceReferenceFacility != null) {
      return updateReferenceFacilityWithDraftDetails(facilityFileState, practiceReferenceFacility);
    } else {
      return confirmFacility(facilityFileState);
    }
  }

  private Optional<Practice> findTargetPractice(
      List<Practice> targetPractices, PracticeReferenceFacilityDto practiceReferenceFacility) {
    if (practiceReferenceFacility == null) {
      return Optional.empty();
    }

    Set<UUID> fileStates =
        facilityApi
            .getFacilityFileStateIdsAssociatedWithReferenceFacility(
                practiceReferenceFacility.referenceFacilityId())
            .fileStateIds()
            .stream()
            .collect(Collectors.toUnmodifiableSet());

    return targetPractices.stream()
        .filter(practice -> fileStates.contains(practice.getCentralFileStateId()))
        .collect(StreamUtil.toSingleOptionalElement());
  }

  private UUID updateReferencePersonWithDraftDetails(
      GetPersonFileStateResponse draftProfessionalFileState,
      ProfessionalReferencePersonDto professionalReference) {
    log.info(
        "Updating person {} in central file state with draft details",
        professionalReference.referenceId());

    AddPersonFileStateResponse updatedFileState =
        personApi.updateReferencePerson(
            professionalReference.referenceId(),
            new UpdateReferencePersonRequest(
                enrich(draftProfessionalFileState, professionalReference),
                professionalReference.version()));

    personApi.markPersonFileStateForDeletion(
        new DeleteFileStatesRequest(draftProfessionalFileState.id()));

    return updatedFileState.id();
  }

  private UUID updateReferenceFacilityWithDraftDetails(
      GetFacilityFileStateResponse fileState, PracticeReferenceFacilityDto practiceReference) {
    log.info(
        "Updating facility {} in central file state with draft details",
        practiceReference.referenceFacilityId());

    AddFacilityFileStateResponse updatedFileState =
        facilityApi.updateReferenceFacility(
            practiceReference.referenceFacilityId(),
            new UpdateReferenceFacilityRequest(
                enrich(fileState, practiceReference), practiceReference.version()));

    facilityApi.markFacilityFileStateForDeletion(new DeleteFileStatesRequest(fileState.id()));

    return updatedFileState.id();
  }

  private UUID confirmPerson(GetPersonFileStateResponse personFileState) {
    log.info("Confirming person {} in central file", personFileState);

    return personApi
        .updatePersonFileStateAndReference(
            personFileState.id(), new UpdatePersonRequest(new PersonDetailsDto(personFileState)))
        .id();
  }

  private PersonDetailsDto enrich(PersonDetails newPersonDetails, PersonDetails oldPersonDetails) {
    return new PersonDetailsDto(
        enrich(PersonDetails::title, newPersonDetails, oldPersonDetails),
        enrich(PersonDetails::salutation, newPersonDetails, oldPersonDetails),
        enrich(PersonDetails::gender, newPersonDetails, oldPersonDetails),
        enrich(PersonDetails::firstName, newPersonDetails, oldPersonDetails),
        enrich(PersonDetails::lastName, newPersonDetails, oldPersonDetails),
        enrich(PersonDetails::dateOfBirth, newPersonDetails, oldPersonDetails),
        enrich(PersonDetails::nameAtBirth, newPersonDetails, oldPersonDetails),
        enrich(PersonDetails::placeOfBirth, newPersonDetails, oldPersonDetails),
        enrich(PersonDetails::countryOfBirth, newPersonDetails, oldPersonDetails),
        enrichList(PersonDetails::emailAddresses, newPersonDetails, oldPersonDetails),
        enrichList(PersonDetails::phoneNumbers, newPersonDetails, oldPersonDetails),
        enrich(PersonDetails::contactAddress, newPersonDetails, oldPersonDetails),
        enrich(PersonDetails::differentBillingAddress, newPersonDetails, oldPersonDetails));
  }

  private FacilityDetailsDto enrich(
      GetFacilityFileStateResponse draftFacilityFileState,
      PracticeReferenceFacilityDto practiceReference) {
    return new FacilityDetailsDto(
        enrich(FacilityDetails::name, draftFacilityFileState, practiceReference),
        enrichList(FacilityDetails::emailAddresses, draftFacilityFileState, practiceReference),
        enrichList(FacilityDetails::phoneNumbers, draftFacilityFileState, practiceReference),
        enrichList(FacilityDetails::contactPersons, draftFacilityFileState, practiceReference),
        enrich(FacilityDetails::contactAddress, draftFacilityFileState, practiceReference),
        enrich(
            FacilityDetails::differentBillingAddress, draftFacilityFileState, practiceReference));
  }

  private static <T, E> List<T> enrichList(Function<E, List<T>> getter, E newState, E oldState) {
    return Stream.of(getter.apply(newState), getter.apply(oldState))
        .flatMap(Collection::stream)
        .distinct()
        .toList();
  }

  private static <T, E> T enrich(Function<E, T> getter, E newState, E oldState) {
    return ofNullable(getter.apply(newState)).orElse(getter.apply(oldState));
  }

  private UUID confirmFacility(GetFacilityFileStateResponse facilityFileState) {
    log.info("Confirming facility {} in central file", facilityFileState.id());
    return facilityApi
        .updateFacilityFileStateAndReference(
            facilityFileState.id(),
            new PutFacilityRequest(new FacilityDetailsDto(facilityFileState)))
        .id();
  }

  private Professional buildProfessional(
      CreateProfessionalDto professional, UUID centralFilePersonId) {
    Professional professionalEntity = new Professional();
    professionalEntity.setCentralFileStateId(centralFilePersonId);
    professionalEntity.setProfessionalTitle(mapToDomain(professional.professionalTitle()));
    professionalEntity.setFieldOfExpertise(professional.fieldOfExpertise());
    professionalEntity.setSpecialistTitle(professional.specialistTitle());
    professionalEntity.setFurtherTraining(professional.furtherTraining());
    professionalEntity.setQualifications(professional.qualifications());
    professionalEntity.setLifetimeDoctorNumber(professional.lifetimeDoctorNumber());
    professionalEntity.setApprobationGrantedOn(professional.approbationGrantedOn());
    professionalEntity.setApprobationIssuingAuthority(professional.approbationIssuingAuthority());
    professionalEntity.setEmploymentType(mapToDomain(professional.employmentType()));
    professionalEntity.setEmploymentStatus(mapToDomain(professional.employmentStatus()));
    professionalEntity.setNationality(professional.nationality());

    return professionalEntity;
  }

  private static Practice buildPractice(CreatePracticeDto practice, UUID centralFileFacilityId) {
    Practice practiceEntity = new Practice();
    practiceEntity.setCentralFileStateId(centralFileFacilityId);
    practiceEntity.setWebsite(practice.website());
    practiceEntity.setInstitutionIdentifier(practice.institutionIdentifier());
    practiceEntity.setEstablishmentNumber(practice.establishmentNumber());
    practiceEntity.setHealthInsuranceAuthorization(practice.healthInsuranceAuthorization());
    practiceEntity.setOpeningHours(practice.openingHours());

    return practiceEntity;
  }

  private UUID createPersonInCentralFile(CreateProfessionalDto professional) {
    AddPersonFileStateResponse addPersonResponse =
        personApi.addPersonFromExternalSource(
            new ExternalAddPersonFileStateRequest(
                professional.title(),
                null,
                professional.gender(),
                professional.firstName(),
                professional.lastName(),
                professional.dateOfBirth(),
                professional.nameAtBirth(),
                professional.placeOfBirth(),
                null,
                toList(professional.emailAddress()),
                toList(professional.phoneNumber()),
                mapAddress(professional.address()),
                null));

    return addPersonResponse.id();
  }

  private UUID createFacilityInCentralFile(
      CreatePracticeDto practice, CreateProfessionalDto professional) {
    AddFacilityFileStateResponse addFacilityResponse =
        facilityApi.addFacilityFromExternalSource(
            new ExternalAddFacilityFileStateRequest(
                practice.name(),
                toList(practice.emailAddress()),
                toList(practice.phoneNumber()),
                List.of(mapContactPerson(professional)),
                mapAddress(practice.address()),
                null));

    return addFacilityResponse.id();
  }

  private static DomesticAddressDto mapAddress(ProfessionalAddressDto address) {
    return new DomesticAddressDto(
        address.country(),
        address.city(),
        address.postalCode(),
        null,
        address.street(),
        address.houseNumber(),
        null);
  }

  private static DomesticAddressDto mapAddress(PracticeAddressDto address) {
    return new DomesticAddressDto(
        CountryCode.DE,
        address.city(),
        address.postalCode(),
        null,
        address.street(),
        address.houseNumber(),
        null);
  }

  private FacilityContactPersonDto mapContactPerson(CreateProfessionalDto professional) {
    return new FacilityContactPersonDto(
        professional.emailAddress(),
        professional.phoneNumber(),
        null,
        professional.lastName(),
        professional.firstName(),
        professional.title(),
        null,
        professional.gender());
  }

  public void deleteProcedure(MedicalRegistryEntry medicalRegistryEntry) {
    UUID professionalId =
        medicalRegistryEntry.getRelatedPersons().stream()
            .collect(StreamUtil.toSingleElement())
            .getExternalId();
    log.info("Marking central file state {} for deletion", professionalId);
    personApi.markPersonFileStateForDeletion(new DeleteFileStatesRequest(professionalId));
    log.info("Marked central file state {} for deletion", professionalId);

    if (medicalRegistryEntry.getRelatedFacilities() != null
        && !medicalRegistryEntry.getRelatedFacilities().isEmpty()) {
      UUID practiceId =
          medicalRegistryEntry.getRelatedFacilities().stream()
              .collect(StreamUtil.toSingleElement())
              .getExternalId();
      log.info("Marking central file state {} for deletion", practiceId);
      facilityApi.markFacilityFileStateForDeletion(new DeleteFileStatesRequest(practiceId));
      log.info("Marked central file state {} for deletion", practiceId);
    }

    medicalRegistryEntry.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
    procedureDeletionService.deleteAndWriteToCemetery(medicalRegistryEntry.getExternalId());
  }

  private static void addSystemProgressEntry(
      MedicalRegistryEntryChange medicalRegistryEntry, TriggerType triggerType) {
    ProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            mapToSystemProgressEntryType(medicalRegistryEntry.getTypeOfChange()).name(),
            triggerType);

    medicalRegistryEntry.addProgressEntry(progressEntry);
  }

  private void addSystemProgressEntryFile(
      MedicalRegistryEntryChange procedure, DocumentData document, TriggerType triggerType)
      throws IOException {
    String description = document.description();
    File file = buildJpeg(document);
    ProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            MedicalRegistrySystemProgressEntryType.DOCUMENT_UPLOAD.name(),
            description,
            triggerType,
            Optional.ofNullable(document.keyDocumentType()).map(Enum::name).orElse(null));
    progressEntry.setFile(file);

    procedure.addProgressEntry(progressEntry);
  }

  private void addSystemProgressEntryAboutRequestForWrittenConfirmationIfNecessary(
      MedicalRegistryEntryChange medicalRegistryEntry, TriggerType triggerType) {
    if (medicalRegistryEntry.isRequestForWrittenConfirmation()) {
      medicalRegistryEntry.addProgressEntry(
          SystemProgressEntryFactory.createSystemProgressEntry(
              MedicalRegistrySystemProgressEntryType.REQUEST_FOR_WRITTEN_CONFIRMATION.name(),
              "Meldebestätigung angefordert",
              triggerType));
    }
  }

  private File buildJpeg(DocumentData document) throws IOException {
    ImageMetaData metaData = new ImageMetaData();
    metaData.setCreatedDate(Instant.now(clock));

    return FileFactory.createImageWithMetaData(
        document.fileName(), ProcedureFileType.JPEG, document.file().getBytes(), metaData);
  }

  private MedicalRegistryEntry createMedicalRegistryEntryFromDraft(
      MedicalRegistryEntryChange draftMedicalRegistryEntry) {
    MedicalRegistryEntry medicalRegistryEntry = new MedicalRegistryEntry(TriggerType.EMPLOYEE);
    log.info(
        "Create new medical registry entry {} from draft", medicalRegistryEntry.getExternalId());

    medicalRegistryEntry.setProcedureType(ProcedureType.MEDICAL_REGISTRY_ENTRY);
    medicalRegistryEntry.updateProcedureStatus(
        getConfirmedProcedureStatusForChangeType(draftMedicalRegistryEntry.getTypeOfChange()),
        clock,
        auditLogger);

    return medicalRegistryEntry;
  }

  private ProcedureStatus getConfirmedProcedureStatusForChangeType(TypeOfChange typeOfChange) {
    if (CLOSING_TYPE_OF_CHANGES.contains(typeOfChange)) {
      return ProcedureStatus.CLOSED;
    } else {
      return ProcedureStatus.OPEN;
    }
  }

  private void copyValuesFromDraft(MedicalRegistryEntry source, MedicalRegistryEntry target) {
    target.setConsentToPrivacyPolicy(source.isConsentToPrivacyPolicy());
    target.setRequestForWrittenConfirmation(source.isRequestForWrittenConfirmation());
    target.setEmployeesEmployed(source.isEmployeesEmployed());

    source.getProgressEntries().forEach(target::addProgressEntry);
  }

  private static List<String> toList(String value) {
    return value == null ? java.util.List.of() : java.util.List.of(value);
  }

  public GetMedicalRegistryEntryOverview getProceduresOverview(
      GetProceduresPaginationOptions paginationOptions,
      GetMedicalRegistryProceduresFilterOptions filterOptions) {
    List<Specification<MedicalRegistryEntry>> specifications = new ArrayList<>();

    if (filterOptions.procedureStatus() != null) {
      Set<ProcedureStatus> domainProcedureStatus =
          mapEnumSet(filterOptions.procedureStatus(), ProcedureMapper::toDomainType);

      specifications.add(statusIsIn(domainProcedureStatus));
    }

    if (filterOptions.certificateRequested() != null) {
      specifications.add(filterByCertificateRequested(filterOptions.certificateRequested()));
    }

    if (filterOptions.professionalTitle() != null) {
      Set<ProfessionalTitle> filteringProfessionalTitles =
          mapEnumSet(filterOptions.professionalTitle(), ProfessionalMapper::mapToDomain);
      specifications.add(filterByProfessionalTitles(filteringProfessionalTitles));
    }

    Page<MedicalRegistryEntry> page =
        medicalRegistryEntryRepository.findAll(
            where(allOf(specifications)),
            ofSize(paginationOptions.pageSize())
                .withPage(paginationOptions.pageNumber())
                .withSort(
                    Sort.by(Sort.Order.asc(PROCEDURE_STATUS))
                        .and(Sort.by(Sort.Order.desc(CREATED_AT)))));

    if (page.isEmpty()) {
      return new GetMedicalRegistryEntryOverview(
          page.getTotalPages(), page.getTotalElements(), List.of());
    }
    List<UUID> relatedPersonIds = collectRelatedPersonIds(page);
    Map<UUID, GetPersonFileStateResponse> resolvedRelatedPerson =
        personApi
            .getPersonFileStates(new GetPersonFileStatesRequest(relatedPersonIds))
            .personFileStates()
            .stream()
            .collect(Collectors.toMap(GetPersonFileStateResponse::id, person -> person));

    List<MedicalRegistryEntryDto> entryDtos =
        page.stream().map(entry -> EntryMapper.mapToDto(entry, resolvedRelatedPerson)).toList();
    return new GetMedicalRegistryEntryOverview(
        page.getTotalPages(), page.getTotalElements(), entryDtos);
  }

  private Specification<MedicalRegistryEntry> filterByProfessionalTitles(
      Set<ProfessionalTitle> filteringProfessionalTitles) {
    return (root, query, criteriaBuilder) -> {
      @SuppressWarnings("unchecked")
      ListJoin<MedicalRegistryEntry, Professional> professional =
          (ListJoin<MedicalRegistryEntry, Professional>) root.join(relatedPersons);
      return professional.get(professionalTitle).in(filteringProfessionalTitles);
    };
  }

  private static List<UUID> collectRelatedPersonIds(
      Page<MedicalRegistryEntry> medicalRegistryEntries) {
    return medicalRegistryEntries.stream()
        .map(
            entry ->
                entry.getRelatedPersons().stream()
                    .collect(StreamUtil.toSingleElement())
                    .getCentralFileStateId())
        .toList();
  }

  private Specification<MedicalRegistryEntry> filterByCertificateRequested(
      Boolean certificateRequested) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get(requestForWrittenConfirmation), certificateRequested);
  }

  private Specification<MedicalRegistryEntry> statusIsIn(Set<ProcedureStatus> statuses) {
    if (statuses == null) {
      return null;
    }
    return (root, query, criteriaBuilder) -> root.get(procedureStatus).in(statuses);
  }
}
