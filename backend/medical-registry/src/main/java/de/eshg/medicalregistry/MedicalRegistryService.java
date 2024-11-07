/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import static de.eshg.lib.procedure.MapperHelper.mapEnumSet;
import static de.eshg.lib.procedure.domain.model.Procedure_.CREATED_AT;
import static de.eshg.lib.procedure.domain.model.Procedure_.PROCEDURE_STATUS;
import static de.eshg.lib.procedure.domain.model.Procedure_.procedureStatus;
import static de.eshg.medicalregistry.domain.model.MedicalRegistryEntry_.requestForWrittenConfirmation;
import static de.eshg.medicalregistry.mapper.ProcedureMapper.mapToDomain;
import static de.eshg.medicalregistry.mapper.ProfessionalMapper.mapToDomain;
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
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.centralfile.api.person.AddPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.ExternalAddPersonFileStateRequest;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStatesRequest;
import de.eshg.base.util.SetUtils;
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
import de.eshg.medicalregistry.api.CreateProcedureRequest;
import de.eshg.medicalregistry.api.GetMedicalRegistryEntryOverview;
import de.eshg.medicalregistry.api.GetMedicalRegistryProceduresFilterOptions;
import de.eshg.medicalregistry.api.MedicalRegistryEntryDto;
import de.eshg.medicalregistry.api.PracticeAddressDto;
import de.eshg.medicalregistry.api.PracticeDto;
import de.eshg.medicalregistry.api.ProfessionalAddressDto;
import de.eshg.medicalregistry.api.ProfessionalDto;
import de.eshg.medicalregistry.business.model.DocumentData;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.Practice;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.medicalregistry.domain.registry.MedicalRegistryEntryRepository;
import de.eshg.medicalregistry.mapper.EntryMapper;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.validation.ValidationUtil;
import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class MedicalRegistryService {

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

  public MedicalRegistryEntry findProcedureByExternalId(UUID procedureId) {
    return medicalRegistryEntryRepository
        .findByExternalId(procedureId)
        .orElseThrow(notFoundException(procedureId));
  }

  public MedicalRegistryEntry findProcedureByExternalIdForUpdate(UUID procedureId, long version) {
    MedicalRegistryEntry medicalRegistryEntry =
        medicalRegistryEntryRepository
            .findByExternalIdForUpdate(procedureId)
            .orElseThrow(notFoundException(procedureId));
    ValidationUtil.validateVersion(version, medicalRegistryEntry);

    return medicalRegistryEntry;
  }

  private static Supplier<NotFoundException> notFoundException(UUID procedureId) {
    return () ->
        new NotFoundException(
            "%s with UUID %s not found"
                .formatted(MedicalRegistryEntry.class.getSimpleName(), procedureId));
  }

  public GetPersonFileStateResponse findProfessionalDetails(UUID externalId) {
    return personApi.getPersonFileState(externalId);
  }

  public GetFacilityFileStateResponse findPracticeDetails(UUID externalId) {
    return facilityApi.getFacilityFileState(externalId);
  }

  public MedicalRegistryEntryChange createProcedure(
      CreateProcedureRequest request, List<DocumentData> documents) throws IOException {
    MedicalRegistryEntryChange medicalRegistryEntry = new MedicalRegistryEntryChange();
    medicalRegistryEntry.setTypeOfChange(mapToDomain(request.typeOfChange()));
    medicalRegistryEntry.setConsentToPrivacyPolicy(request.consentToPrivacyPolicy());
    medicalRegistryEntry.setEmployeesEmployed(request.employeesEmployed());
    medicalRegistryEntry.setRequestForWrittenConfirmation(request.requestForWrittenConfirmation());
    medicalRegistryEntry.setProcedureType(ProcedureType.MEDICAL_REGISTRY_EMPLOYEE_DRAFT);
    medicalRegistryEntry.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);

    ProfessionalDto professional = request.professional();
    UUID personId = createPersonInCentralFile(professional);
    medicalRegistryEntry.addRelatedPerson(buildProfessional(professional, personId));

    PracticeDto practice = request.practice();
    if (practice != null) {
      UUID facilityId = createFacilityInCentralFile(practice, professional);
      medicalRegistryEntry.addRelatedFacility(buildPractice(practice, facilityId));
    }

    addSystemProgressEntry(medicalRegistryEntry);

    for (DocumentData document : documents) {
      addSystemProgressEntryFile(medicalRegistryEntry, document);
    }

    return medicalRegistryEntryRepository.save(medicalRegistryEntry);
  }

  private Professional buildProfessional(ProfessionalDto professional, UUID centralFilePersonId) {
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

  private static Practice buildPractice(PracticeDto practice, UUID centralFileFacilityId) {
    Practice practiceEntity = new Practice();
    practiceEntity.setCentralFileStateId(centralFileFacilityId);
    practiceEntity.setWebsite(practice.website());
    practiceEntity.setInstitutionIdentifier(practice.institutionIdentifier());
    practiceEntity.setEstablishmentNumber(practice.establishmentNumber());
    practiceEntity.setHealthInsuranceAuthorization(practice.healthInsuranceAuthorization());
    practiceEntity.setOpeningHours(practice.openingHours());

    return practiceEntity;
  }

  private UUID createPersonInCentralFile(ProfessionalDto professional) {
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

  private UUID createFacilityInCentralFile(PracticeDto practice, ProfessionalDto professional) {
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

  private FacilityContactPersonDto mapContactPerson(ProfessionalDto professional) {
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
    personApi.markPersonFileStateForDeletion(
        new DeleteFileStatesRequest(SetUtils.of(professionalId)));
    log.info("Marked central file state {} for deletion", professionalId);

    if (medicalRegistryEntry.getRelatedFacilities() != null) {
      UUID practiceId =
          medicalRegistryEntry.getRelatedFacilities().stream()
              .collect(StreamUtil.toSingleElement())
              .getExternalId();
      log.info("Marking central file state {} for deletion", practiceId);
      facilityApi.markFacilityFileStateForDeletion(
          new DeleteFileStatesRequest(SetUtils.of(practiceId)));
      log.info("Marked central file state {} for deletion", practiceId);
    }

    medicalRegistryEntry.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
    procedureDeletionService.deleteAndWriteToCemetery(medicalRegistryEntry.getExternalId());
  }

  private static void addSystemProgressEntry(MedicalRegistryEntryChange medicalRegistryEntry) {
    ProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            medicalRegistryEntry.getTypeOfChange().name(), TriggerType.SYSTEM_AUTOMATIC);

    medicalRegistryEntry.addProgressEntry(progressEntry);
  }

  private void addSystemProgressEntryFile(
      MedicalRegistryEntryChange procedure, DocumentData document) throws IOException {
    String description = document.getDescription();
    File file = buildJpeg(document);
    ProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            procedure.getTypeOfChange().name(), description, TriggerType.SYSTEM_AUTOMATIC);
    progressEntry.setFile(file);

    procedure.addProgressEntry(progressEntry);
  }

  private File buildJpeg(DocumentData document) throws IOException {
    ImageMetaData metaData = new ImageMetaData();
    metaData.setCreatedDate(Instant.now(clock));

    return FileFactory.createImageWithMetaData(
        document.getFileName(), ProcedureFileType.JPEG, document.getFile().getBytes(), metaData);
  }

  private static List<String> toList(String value) {
    return value == null ? List.of() : List.of(value);
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
    Map<UUID, AddPersonFileStateResponse> resolvedRelatedPerson =
        personApi
            .getPersonFileStates(new GetPersonFileStatesRequest(relatedPersonIds))
            .personFileStates()
            .stream()
            .collect(Collectors.toMap(AddPersonFileStateResponse::id, person -> person));

    List<MedicalRegistryEntryDto> entryDtos =
        page.stream().map(entry -> EntryMapper.mapToDto(entry, resolvedRelatedPerson)).toList();
    return new GetMedicalRegistryEntryOverview(
        page.getTotalPages(), page.getTotalElements(), entryDtos);
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
