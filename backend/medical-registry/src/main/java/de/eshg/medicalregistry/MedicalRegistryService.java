/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import static de.eshg.domain.model.SequencedBaseEntity_.ID;
import static de.eshg.lib.procedure.MapperHelper.mapEnumSet;
import static de.eshg.lib.procedure.domain.model.Procedure_.CREATED_AT;
import static de.eshg.lib.procedure.domain.model.Procedure_.PROCEDURE_STATUS;
import static de.eshg.lib.procedure.domain.model.Procedure_.procedureStatus;
import static de.eshg.medicalregistry.Validator.asMapper;
import static de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure_.requestForWrittenConfirmation;
import static de.eshg.medicalregistry.mapper.ProcedureMapper.mapToSystemProgressEntryType;
import static org.springframework.data.domain.PageRequest.ofSize;
import static org.springframework.data.domain.Sort.by;
import static org.springframework.data.jpa.domain.Specification.allOf;
import static org.springframework.data.jpa.domain.Specification.where;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.auditlog.AuditLogger;
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
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.lib.xlsximport.RowValues;
import de.eshg.medicalregistry.api.CreateFullProcedureChangeRequest;
import de.eshg.medicalregistry.api.CreatePracticeDto;
import de.eshg.medicalregistry.api.CreateProcedureRequest;
import de.eshg.medicalregistry.api.GetMedicalRegistryEntryOverview;
import de.eshg.medicalregistry.api.GetMedicalRegistryProceduresFilterOptions;
import de.eshg.medicalregistry.api.GetMedicalRegistryProceduresPaginationOptions;
import de.eshg.medicalregistry.api.MedicalRegistryEntryDto;
import de.eshg.medicalregistry.api.PracticeReferenceFacilityDto;
import de.eshg.medicalregistry.api.ProfessionalReferencePersonDto;
import de.eshg.medicalregistry.business.model.DocumentData;
import de.eshg.medicalregistry.domain.model.Deregistration;
import de.eshg.medicalregistry.domain.model.FullProcedureChange;
import de.eshg.medicalregistry.domain.model.FullProcedureChange_;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry_;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.model.MedicalRegistrySystemProgressEntryType;
import de.eshg.medicalregistry.domain.model.Practice;
import de.eshg.medicalregistry.domain.model.ProfessionInformation;
import de.eshg.medicalregistry.domain.model.ProfessionInformation_;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.medicalregistry.domain.model.ProfessionalTitle;
import de.eshg.medicalregistry.domain.model.TypeOfChange;
import de.eshg.medicalregistry.domain.registry.MedicalRegistryEntryRepository;
import de.eshg.medicalregistry.importer.MedicalRegistryRowValues;
import de.eshg.medicalregistry.mapper.CreationMapper;
import de.eshg.medicalregistry.mapper.EntryMapper;
import de.eshg.medicalregistry.mapper.ProfessionalMapper;
import de.eshg.validation.ValidationUtil;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.apache.commons.collections4.ListUtils;
import org.apache.poi.ss.usermodel.Row;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class MedicalRegistryService {
  private static final Logger log = LoggerFactory.getLogger(MedicalRegistryService.class);

  private final MedicalRegistryEntryRepository medicalRegistryEntryRepository;
  private final ProcedureDeletionService<MedicalRegistryProcedure> procedureDeletionService;
  private final PersonService personService;
  private final FacilityService facilityService;
  private final AuditLogger auditLogger;
  private final Clock clock;

  public MedicalRegistryService(
      MedicalRegistryEntryRepository medicalRegistryEntryRepository,
      ProcedureDeletionService<MedicalRegistryProcedure> procedureDeletionService,
      PersonService personService,
      FacilityService facilityService,
      AuditLogger auditLogger,
      Clock clock) {
    this.medicalRegistryEntryRepository = medicalRegistryEntryRepository;
    this.procedureDeletionService = procedureDeletionService;
    this.personService = personService;
    this.facilityService = facilityService;
    this.auditLogger = auditLogger;
    this.clock = clock;
  }

  public Optional<MedicalRegistryProcedure> findProcedureByExternalId(UUID procedureId) {
    return medicalRegistryEntryRepository.findByExternalId(procedureId);
  }

  public Optional<MedicalRegistryProcedure> findProcedureByExternalIdForUpdate(
      UUID procedureId, long version) {
    return medicalRegistryEntryRepository
        .findByExternalIdForUpdate(procedureId)
        .map(asMapper(entry -> ValidationUtil.validateVersion(version, entry)));
  }

  public MedicalRegistryEntryChange createProcedure(
      CreateProcedureRequest createProcedureRequest,
      List<DocumentData> documents,
      TriggerType triggerType,
      ProcedureType procedureType) {
    UUID personId = personService.createPersonInCentralFile(createProcedureRequest.applicant());
    UUID facilityId =
        facilityService.createFacilityInCentralFile(
            getPractice(createProcedureRequest), createProcedureRequest.applicant());

    MedicalRegistryEntryChange medicalRegistryEntry =
        CreationMapper.mapToDomain(createProcedureRequest, triggerType, personId, facilityId);

    addSystemProgressEntry(medicalRegistryEntry, triggerType);
    addSystemProgressEntryAboutRequestForWrittenConfirmationIfNecessary(
        medicalRegistryEntry, triggerType);

    for (DocumentData document : documents) {
      addSystemProgressEntryFile(medicalRegistryEntry, document, triggerType);
    }

    medicalRegistryEntry.setProcedureType(procedureType);
    medicalRegistryEntry.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);

    return medicalRegistryEntryRepository.save(medicalRegistryEntry);
  }

  private CreatePracticeDto getPractice(CreateProcedureRequest createProcedureRequest) {
    return switch (createProcedureRequest) {
      case CreateFullProcedureChangeRequest createFullProcedureChangeRequest ->
          createFullProcedureChangeRequest.practice();
      default -> null;
    };
  }

  public Map<Row, Optional<UUID>> createProceduresFromImport(
      List<MedicalRegistryRowValues> rowValues) {
    Map<Row, UUID> professionalIds = personService.createPersonsInCentralFile(rowValues);
    Map<Row, UUID> practiceIds = facilityService.createFacilitiesInCentralFile(rowValues);
    return rowValues.stream()
        .collect(
            Collectors.toMap(
                RowValues::getRow,
                rowValue ->
                    Optional.ofNullable(
                        createProcedureFromImport(
                            rowValue,
                            professionalIds.get(rowValue.getRow()),
                            practiceIds.get(rowValue.getRow())))));
  }

  private UUID createProcedureFromImport(
      MedicalRegistryRowValues rowValue, UUID professionalId, UUID practiceId) {
    try {
      MedicalRegistryEntry medicalRegistryEntry =
          CreationMapper.mapToDomain(rowValue, professionalId, practiceId);

      medicalRegistryEntry.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);

      addSystemProgressEntry(
          medicalRegistryEntry, TypeOfChange.NEW_REGISTRATION, TriggerType.SYSTEM_AUTOMATIC);

      return medicalRegistryEntryRepository.save(medicalRegistryEntry).getExternalId();
    } catch (Exception e) {
      log.error(
          "Error during importing procedure (row number " + rowValue.getRow().getRowNum() + ")", e);
      return null;
    }
  }

  public MedicalRegistryProcedure confirmProcedure(
      MedicalRegistryEntryChange draftMedicalRegistryEntry,
      ProfessionalReferencePersonDto professionalReferencePerson,
      PracticeReferenceFacilityDto practiceReferenceFacility,
      MedicalRegistryEntry mergeTarget) {
    log.info(
        "Confirming draft medical registry entry {}", draftMedicalRegistryEntry.getExternalId());

    MedicalRegistryEntry medicalRegistryProcedure =
        Optional.ofNullable(mergeTarget).orElseGet(this::createMedicalRegistryEntry);

    copyValuesFromDraft(draftMedicalRegistryEntry, medicalRegistryProcedure);

    updateOrConfirmProfessional(
        draftMedicalRegistryEntry.getProfessional(),
        medicalRegistryProcedure,
        professionalReferencePerson);

    updateOrConfirmPractice(
        draftMedicalRegistryEntry.getRelatedFacilities(),
        medicalRegistryProcedure,
        practiceReferenceFacility);

    updateProfessionInformation(draftMedicalRegistryEntry, medicalRegistryProcedure);

    if (draftMedicalRegistryEntry instanceof Deregistration) {
      medicalRegistryProcedure.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
    }

    if (mergeTarget == null) {
      medicalRegistryEntryRepository.save(medicalRegistryProcedure);
    }

    log.info("Deleting draft medical registry entry {}", draftMedicalRegistryEntry.getExternalId());
    procedureDeletionService.deleteAndWriteToCemetery(draftMedicalRegistryEntry);

    return medicalRegistryProcedure;
  }

  private void updateProfessionInformation(
      MedicalRegistryEntryChange source, MedicalRegistryEntry target) {
    getProfessionalInformation(source)
        .ifPresent(
            sourceProfessionInformation -> {
              updateProfessionalInformation(sourceProfessionInformation, target);
            });
  }

  private void updateProfessionalInformation(
      ProfessionInformation sourceProfessionInformation, MedicalRegistryEntry target) {
    ProfessionInformation targetProfessionInformation =
        Optional.ofNullable(target.getProfessionInformation())
            .orElseGet(ProfessionInformation::new);
    target.setProfessionInformation(targetProfessionInformation);

    targetProfessionInformation.setProfessionalTitle(
        sourceProfessionInformation.getProfessionalTitle());
    targetProfessionInformation.setFieldOfExpertise(
        sourceProfessionInformation.getFieldOfExpertise());
    targetProfessionInformation.setSpecialistTitle(
        sourceProfessionInformation.getSpecialistTitle());
    targetProfessionInformation.setFurtherTraining(
        sourceProfessionInformation.getFurtherTraining());
    targetProfessionInformation.setQualifications(sourceProfessionInformation.getQualifications());
    targetProfessionInformation.setLifetimeDoctorNumber(
        sourceProfessionInformation.getLifetimeDoctorNumber());
    targetProfessionInformation.setApprobationGrantedOn(
        sourceProfessionInformation.getApprobationGrantedOn());
    targetProfessionInformation.setApprobationIssuingAuthority(
        sourceProfessionInformation.getApprobationIssuingAuthority());
    targetProfessionInformation.setEmploymentType(sourceProfessionInformation.getEmploymentType());
    targetProfessionInformation.setEmploymentStatus(
        sourceProfessionInformation.getEmploymentStatus());
  }

  private Optional<Boolean> getIsEmployeesEmployed(MedicalRegistryEntryChange source) {
    return switch (source) {
      case FullProcedureChange fullProcedureChange ->
          Optional.of(fullProcedureChange.isEmployeesEmployed());
      case Deregistration ignored -> Optional.empty();
    };
  }

  private Optional<ProfessionInformation> getProfessionalInformation(
      MedicalRegistryEntryChange source) {
    return switch (source) {
      case FullProcedureChange fullProcedureChange ->
          Optional.of(fullProcedureChange.getProfessionInformation());
      case Deregistration ignored -> Optional.empty();
    };
  }

  private void updateOrConfirmProfessional(
      Professional sourceProfessional,
      MedicalRegistryProcedure targetEntry,
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
    targetProfessional.setNationality(sourceProfessional.getNationality());

    targetProfessional.setCentralFileStateId(
        personService.updateOrConfirmProfessional(
            sourceProfessional.getCentralFileStateId(), professionalReferencePerson));
  }

  private Professional addProfessionalToEntry(
      Professional professional, MedicalRegistryProcedure entry) {
    entry.addRelatedPerson(professional);
    return professional;
  }

  private void updateOrConfirmPractice(
      List<Practice> sourcePractices,
      MedicalRegistryProcedure targetEntry,
      PracticeReferenceFacilityDto practiceReferenceFacility) {
    sourcePractices.stream()
        .collect(StreamUtil.toSingleOptionalElement())
        .ifPresent(
            sourcePractice ->
                updateOrConfirmPractice(sourcePractice, targetEntry, practiceReferenceFacility));
  }

  private void updateOrConfirmPractice(
      Practice sourcePractice,
      MedicalRegistryProcedure targetEntry,
      PracticeReferenceFacilityDto practiceReferenceFacility) {
    Practice targetPractice =
        facilityService
            .findTargetPractice(targetEntry.getRelatedFacilities(), practiceReferenceFacility)
            .orElseGet(() -> addPracticeToEntry(sourcePractice, targetEntry));

    updateOrConfirmPractice(sourcePractice, targetPractice, practiceReferenceFacility);
  }

  private Practice addPracticeToEntry(Practice practice, MedicalRegistryProcedure target) {
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
        facilityService.updateOrConfirmPractice(
            sourcePractice.getCentralFileStateId(), practiceReferenceFacility));
  }

  public Set<UUID> findExistingProcedureIds(List<UUID> candidates, int batchSize) {
    if (candidates.isEmpty()) {
      return Collections.emptySet();
    } else if (candidates.size() > batchSize) {
      return ListUtils.partition(candidates, batchSize).stream()
          .map(candidatesPartition -> findExistingProcedureIds(candidatesPartition, batchSize))
          .flatMap(Set::stream)
          .collect(Collectors.toSet());
    } else {
      return medicalRegistryEntryRepository.findExistingExternalIds(candidates);
    }
  }

  public void deleteProcedure(MedicalRegistryProcedure medicalRegistryProcedure) {
    UUID professionalId =
        medicalRegistryProcedure.getRelatedPersons().stream()
            .collect(StreamUtil.toSingleElement())
            .getExternalId();
    log.info("Marking central file state {} for deletion", professionalId);
    personService.deleteInCentralFile(professionalId);
    log.info("Marked central file state {} for deletion", professionalId);

    if (medicalRegistryProcedure.getRelatedFacilities() != null
        && !medicalRegistryProcedure.getRelatedFacilities().isEmpty()) {
      UUID practiceId =
          medicalRegistryProcedure.getRelatedFacilities().stream()
              .collect(StreamUtil.toSingleElement())
              .getExternalId();
      log.info("Marking central file state {} for deletion", practiceId);
      facilityService.deleteInCentralFile(practiceId);
      log.info("Marked central file state {} for deletion", practiceId);
    }

    medicalRegistryProcedure.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
    procedureDeletionService.deleteAndWriteToCemetery(medicalRegistryProcedure.getExternalId());
  }

  private static void addSystemProgressEntry(
      MedicalRegistryEntryChange medicalRegistryEntry, TriggerType triggerType) {
    addSystemProgressEntry(
        medicalRegistryEntry, medicalRegistryEntry.getTypeOfChange(), triggerType);
  }

  private static void addSystemProgressEntry(
      MedicalRegistryProcedure medicalRegistryEntry,
      TypeOfChange typeOfChange,
      TriggerType triggerType) {
    ProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            mapToSystemProgressEntryType(typeOfChange).name(), triggerType);

    medicalRegistryEntry.addProgressEntry(progressEntry);
  }

  private void addSystemProgressEntryFile(
      MedicalRegistryEntryChange procedure, DocumentData document, TriggerType triggerType) {
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

  private File buildJpeg(DocumentData document) {
    ImageMetaData metaData = new ImageMetaData();
    metaData.setCreatedDate(Instant.now(clock));

    try {
      return FileFactory.createImageWithMetaData(
          document.fileName(), ProcedureFileType.JPEG, document.file().getBytes(), metaData);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  private MedicalRegistryEntry createMedicalRegistryEntry() {
    MedicalRegistryEntry medicalRegistryProcedure = new MedicalRegistryEntry();
    log.info(
        "Create new medical registry entry {} from draft",
        medicalRegistryProcedure.getExternalId());

    medicalRegistryProcedure.setProcedureType(ProcedureType.MEDICAL_REGISTRY_ENTRY);
    medicalRegistryProcedure.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);

    medicalRegistryProcedure.getProgressEntries().clear();
    return medicalRegistryProcedure;
  }

  private void copyValuesFromDraft(MedicalRegistryEntryChange source, MedicalRegistryEntry target) {
    target.setConsentToPrivacyPolicy(source.isConsentToPrivacyPolicy());
    target.setRequestForWrittenConfirmation(source.isRequestForWrittenConfirmation());
    getIsEmployeesEmployed(source).ifPresent(target::setEmployeesEmployed);

    source.getProgressEntries().forEach(target::addProgressEntry);
  }

  public GetMedicalRegistryEntryOverview getProceduresOverview(
      GetMedicalRegistryProceduresPaginationOptions paginationOptions,
      GetMedicalRegistryProceduresFilterOptions filterOptions) {
    List<Specification<MedicalRegistryProcedure>> specifications = new ArrayList<>();

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

    Page<MedicalRegistryProcedure> page =
        medicalRegistryEntryRepository.findAll(
            where(allOf(specifications)),
            ofSize(paginationOptions.pageSize())
                .withPage(paginationOptions.pageNumber())
                .withSort(by(Order.asc(PROCEDURE_STATUS), Order.desc(CREATED_AT), Order.asc(ID))));

    if (page.isEmpty()) {
      return new GetMedicalRegistryEntryOverview(
          page.getTotalPages(), page.getTotalElements(), List.of());
    }
    List<UUID> relatedPersonIds = collectRelatedPersonIds(page);
    Map<UUID, GetPersonFileStateResponse> resolvedRelatedPerson =
        personService.resolvePersonIds(relatedPersonIds);

    List<MedicalRegistryEntryDto> entryDtos =
        page.stream().map(entry -> EntryMapper.mapToDto(entry, resolvedRelatedPerson)).toList();
    return new GetMedicalRegistryEntryOverview(
        page.getTotalPages(), page.getTotalElements(), entryDtos);
  }

  private Specification<MedicalRegistryProcedure> filterByProfessionalTitles(
      Set<ProfessionalTitle> filteringProfessionalTitles) {
    return (root, query, criteriaBuilder) -> {
      Predicate confirmedEntryWithProfessionalTitle =
          criteriaBuilder
              .treat(root, MedicalRegistryEntry.class)
              .join(MedicalRegistryEntry_.professionInformation, JoinType.LEFT)
              .get(ProfessionInformation_.professionalTitle)
              .in(filteringProfessionalTitles);

      Predicate pendingRegistrationWithProfessionalTitle =
          criteriaBuilder
              .treat(root, FullProcedureChange.class)
              .join(FullProcedureChange_.professionInformation, JoinType.LEFT)
              .get(ProfessionInformation_.professionalTitle)
              .in(filteringProfessionalTitles);

      return criteriaBuilder.or(
          confirmedEntryWithProfessionalTitle, pendingRegistrationWithProfessionalTitle);
    };
  }

  private static List<UUID> collectRelatedPersonIds(
      Page<MedicalRegistryProcedure> medicalRegistryEntries) {
    return medicalRegistryEntries.stream()
        .map(
            entry ->
                entry.getRelatedPersons().stream()
                    .collect(StreamUtil.toSingleElement())
                    .getCentralFileStateId())
        .toList();
  }

  private Specification<MedicalRegistryProcedure> filterByCertificateRequested(
      Boolean certificateRequested) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get(requestForWrittenConfirmation), certificateRequested);
  }

  private Specification<MedicalRegistryProcedure> statusIsIn(Set<ProcedureStatus> statuses) {
    if (statuses == null) {
      return null;
    }
    return (root, query, criteriaBuilder) -> root.get(procedureStatus).in(statuses);
  }
}
