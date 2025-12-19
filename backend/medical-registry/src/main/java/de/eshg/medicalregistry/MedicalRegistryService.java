/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry;

import static de.eshg.medicalregistry.Validator.asMapper;
import static de.eshg.medicalregistry.mapper.ProcedureMapper.mapToSystemProgressEntryType;
import static java.util.function.Predicate.not;
import static org.springframework.data.domain.PageRequest.ofSize;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.facility.FacilityDetails;
import de.eshg.base.centralfile.api.facility.GetReferenceFacilityResponse;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.base.centralfile.api.person.GetReferencePersonResponse;
import de.eshg.base.centralfile.api.person.PersonDetails;
import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.BasicSystemProgressEntryType;
import de.eshg.lib.procedure.domain.model.Image;
import de.eshg.lib.procedure.domain.model.ImageMetaData;
import de.eshg.lib.procedure.domain.model.PersonType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.procedures.ProcedureDeletionService;
import de.eshg.lib.procedure.progressentry.ProgressEntryService;
import de.eshg.medicalregistry.api.CreateFullChangeRequest;
import de.eshg.medicalregistry.api.CreatePracticeChangeRequest;
import de.eshg.medicalregistry.api.CreatePracticeDto;
import de.eshg.medicalregistry.api.CreateProcedureRequest;
import de.eshg.medicalregistry.api.GetMedicalRegistryEntries;
import de.eshg.medicalregistry.api.GetMedicalRegistryProceduresFilterOptions;
import de.eshg.medicalregistry.api.GetMedicalRegistryProceduresPaginationOptions;
import de.eshg.medicalregistry.api.PracticeReferenceFacilityDto;
import de.eshg.medicalregistry.api.ProfessionalReferencePersonDto;
import de.eshg.medicalregistry.api.ResolvedEmployeeChangeDto;
import de.eshg.medicalregistry.business.model.DocumentData;
import de.eshg.medicalregistry.domain.model.Employee;
import de.eshg.medicalregistry.domain.model.EmployeeChange;
import de.eshg.medicalregistry.domain.model.EmployeeChangeType;
import de.eshg.medicalregistry.domain.model.FullMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.MedicalRegistryProcedure;
import de.eshg.medicalregistry.domain.model.MedicalRegistrySystemProgressEntryType;
import de.eshg.medicalregistry.domain.model.PartialMedicalRegistryEntryChange;
import de.eshg.medicalregistry.domain.model.Practice;
import de.eshg.medicalregistry.domain.model.ProfessionInformation;
import de.eshg.medicalregistry.domain.model.Professional;
import de.eshg.medicalregistry.domain.model.TypeOfChange;
import de.eshg.medicalregistry.domain.repository.MedicalRegistryProcedureRepository;
import de.eshg.medicalregistry.domain.specification.MedicalRegistryProcedureOverviewSpecification;
import de.eshg.medicalregistry.importer.MedicalRegistryRow;
import de.eshg.medicalregistry.mapper.CreationMapper;
import de.eshg.medicalregistry.mapper.EntryMapper;
import de.eshg.medicalregistry.mapper.ProcedureMapper;
import de.eshg.validation.ValidationUtil;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.collections4.ListUtils;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class MedicalRegistryService {
  private static final Logger log = LoggerFactory.getLogger(MedicalRegistryService.class);
  private static final Set<TypeOfChange> DEREGISTRATION_TYPE_OF_CHANGES =
      EnumSet.of(TypeOfChange.DEREGISTRATION, TypeOfChange.RELOCATION);
  private static final Set<String> MEDICAL_REGISTRY_ENTRY_CHANGE_PROGRESS_ENTRY_TYPES =
      Arrays.stream(TypeOfChange.values())
          .map(ProcedureMapper::mapToSystemProgressEntryType)
          .map(Enum::name)
          .collect(Collectors.toSet());

  private final MedicalRegistryProcedureRepository medicalRegistryProcedureRepository;
  private final ProcedureDeletionService<MedicalRegistryProcedure> procedureDeletionService;
  private final PersonService personService;
  private final FacilityService facilityService;
  private final AuditLogger auditLogger;
  private final Clock clock;
  private final ProgressEntryService<MedicalRegistryProcedure> progressEntryService;

  public MedicalRegistryService(
      MedicalRegistryProcedureRepository medicalRegistryProcedureRepository,
      ProcedureDeletionService<MedicalRegistryProcedure> procedureDeletionService,
      PersonService personService,
      FacilityService facilityService,
      AuditLogger auditLogger,
      Clock clock,
      ProgressEntryService<MedicalRegistryProcedure> progressEntryService) {
    this.medicalRegistryProcedureRepository = medicalRegistryProcedureRepository;
    this.procedureDeletionService = procedureDeletionService;
    this.personService = personService;
    this.facilityService = facilityService;
    this.auditLogger = auditLogger;
    this.clock = clock;
    this.progressEntryService = progressEntryService;
  }

  public Optional<MedicalRegistryProcedure> findProcedureByExternalId(UUID procedureId) {
    return medicalRegistryProcedureRepository.findByExternalId(procedureId);
  }

  public Optional<MedicalRegistryProcedure> findProcedureByExternalIdForUpdate(
      UUID procedureId, long version) {
    return medicalRegistryProcedureRepository
        .findByExternalIdForUpdate(procedureId)
        .map(asMapper(entry -> ValidationUtil.validateVersion(version, entry)));
  }

  public MedicalRegistryEntryChange createProcedure(
      CreateProcedureRequest createProcedureRequest,
      List<DocumentData> documents,
      TriggerType triggerType,
      ProcedureType procedureType) {
    PersonService.CreatedPersons createdPersons =
        personService.createPersonsInCentralFileState(createProcedureRequest);
    UUID facilityId =
        facilityService.createFacilityInCentralFile(
            getPractice(createProcedureRequest), createProcedureRequest.applicant());

    MedicalRegistryEntryChange medicalRegistryEntry =
        CreationMapper.mapToDomain(
            createProcedureRequest,
            triggerType,
            createdPersons.applicantPersonId(),
            createdPersons.employeeChangePersonIds(),
            facilityId);

    medicalRegistryEntry.setProcedureType(procedureType);
    medicalRegistryEntry.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);

    addSystemProgressEntry(medicalRegistryEntry, triggerType);
    addSystemProgressEntryAboutRequestForWrittenConfirmationIfNecessary(
        medicalRegistryEntry, triggerType);

    for (DocumentData document : documents) {
      addSystemProgressEntryFile(medicalRegistryEntry, document, triggerType);
    }

    return medicalRegistryProcedureRepository.save(medicalRegistryEntry);
  }

  private CreatePracticeDto getPractice(CreateProcedureRequest createProcedureRequest) {
    return switch (createProcedureRequest) {
      case CreateFullChangeRequest createFullChangeRequest -> createFullChangeRequest.practice();
      case CreatePracticeChangeRequest createPracticeChangeRequest ->
          createPracticeChangeRequest.practice();
      default -> null;
    };
  }

  public Map<MedicalRegistryRow, Optional<UUID>> createProceduresFromImport(
      List<MedicalRegistryRow> rows) {
    Map<MedicalRegistryRow, UUID> professionalIds = personService.createPersonsInCentralFile(rows);
    Map<MedicalRegistryRow, UUID> practiceIds = facilityService.createFacilitiesInCentralFile(rows);
    return rows.stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                Function.identity(),
                row ->
                    Optional.ofNullable(
                        createProcedureFromImport(
                            row, professionalIds.get(row), practiceIds.get(row)))));
  }

  private UUID createProcedureFromImport(
      MedicalRegistryRow row, UUID professionalId, UUID practiceId) {
    try {
      MedicalRegistryEntry medicalRegistryEntry =
          CreationMapper.mapToDomain(row, professionalId, practiceId);

      medicalRegistryEntry.updateProcedureStatus(ProcedureStatus.OPEN, clock, auditLogger);

      addSystemProgressEntry(
          medicalRegistryEntry, TypeOfChange.NEW_REGISTRATION, TriggerType.SYSTEM_AUTOMATIC);

      return medicalRegistryProcedureRepository.save(medicalRegistryEntry).getExternalId();
    } catch (Exception e) {
      log.error("Error during importing procedure (row number " + row.getRowNum() + ")", e);
      return null;
    }
  }

  public MedicalRegistryEntry confirmProcedure(
      MedicalRegistryEntryChange draftMedicalRegistryEntry,
      ProfessionalReferencePersonDto professionalReferencePerson,
      PracticeReferenceFacilityDto practiceReferenceFacility,
      List<ResolvedEmployeeChangeDto> employeeChanges,
      MedicalRegistryEntry mergeTarget) {
    log.info(
        "Confirming draft medical registry entry {}", draftMedicalRegistryEntry.getExternalId());

    MedicalRegistryEntry medicalRegistryEntry =
        Optional.ofNullable(mergeTarget).orElseGet(this::createMedicalRegistryEntry);

    copyValuesFromDraft(draftMedicalRegistryEntry, medicalRegistryEntry);

    updateOrConfirmProfessional(
        draftMedicalRegistryEntry, medicalRegistryEntry, professionalReferencePerson);

    updateOrConfirmPractice(
        draftMedicalRegistryEntry, medicalRegistryEntry, practiceReferenceFacility);

    updateProfessionInformation(draftMedicalRegistryEntry, medicalRegistryEntry);

    updateEmployees(draftMedicalRegistryEntry, medicalRegistryEntry, employeeChanges);

    if (DEREGISTRATION_TYPE_OF_CHANGES.contains(draftMedicalRegistryEntry.getTypeOfChange())) {
      medicalRegistryEntry.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
    }

    if (mergeTarget == null) {
      medicalRegistryProcedureRepository.save(medicalRegistryEntry);
    }

    log.info(
        "Confirmation finished. Initiating writing to cemetery and deletion of now obsolete draft {}",
        draftMedicalRegistryEntry.getExternalId());
    procedureDeletionService.deleteAndWriteToCemetery(draftMedicalRegistryEntry);

    return medicalRegistryEntry;
  }

  private void updateEmployees(
      MedicalRegistryEntryChange source,
      MedicalRegistryEntry target,
      List<ResolvedEmployeeChangeDto> employeeChanges) {
    final Map<UUID, EmployeeChange> employeeChangesByIds =
        source.getEmployees().stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    SequencedBaseEntityWithExternalId::getExternalId, Function.identity()));

    final Map<EmployeeChangeType, List<ResolvedEmployeeChangeDto>> employeeChangesByChangeType =
        employeeChanges.stream()
            .collect(
                StreamUtil.groupingBy(
                    employeeChange ->
                        employeeChangesByIds
                            .get(employeeChange.employeeChangeId())
                            .getEmployeeChangeType()));

    applyRemoves(target, employeeChangesByChangeType);
    applyCreations(target, employeeChangesByChangeType);
  }

  private void applyCreations(
      MedicalRegistryEntry target,
      Map<EmployeeChangeType, List<ResolvedEmployeeChangeDto>> employeeChangesByChangeType) {
    final List<ResolvedEmployeeChangeDto> employeesToCreate =
        Optional.ofNullable(employeeChangesByChangeType.get(EmployeeChangeType.ADD)).stream()
            .flatMap(Collection::stream)
            .filter(Predicate.not(this::employeeIsAttachedAtTargetProcedure))
            .toList();

    final List<UUID> employeesInCentralFile =
        personService.createEmployeesInCentralFile(employeesToCreate);

    final List<Employee> personsToAdd =
        employeesInCentralFile.stream().map(this::mapToDomain).toList();

    personsToAdd.forEach(target::addRelatedPerson);
  }

  private void applyRemoves(
      MedicalRegistryEntry target,
      Map<EmployeeChangeType, List<ResolvedEmployeeChangeDto>> employeeChangesByChangeType) {
    final Set<UUID> employeesToRemove =
        Optional.ofNullable(employeeChangesByChangeType.get(EmployeeChangeType.REMOVE)).stream()
            .flatMap(Collection::stream)
            .filter(this::employeeIsAttachedAtTargetProcedure)
            .map(ResolvedEmployeeChangeDto::employeeId)
            .collect(Collectors.toSet());

    target
        .getRelatedPersons()
        .removeIf(employee -> employeesToRemove.contains(employee.getExternalId()));
  }

  private boolean employeeIsAttachedAtTargetProcedure(ResolvedEmployeeChangeDto change) {
    return change.employeeId() != null;
  }

  private Employee mapToDomain(UUID fileStateId) {
    final Employee employee = new Employee();
    employee.setCentralFileStateId(fileStateId);
    return employee;
  }

  private void updateProfessionInformation(
      MedicalRegistryEntryChange source, MedicalRegistryEntry target) {
    getProfessionalInformation(source)
        .ifPresent(
            sourceProfessionInformation ->
                updateProfessionalInformation(sourceProfessionInformation, target));
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

  private Optional<ProfessionInformation> getProfessionalInformation(
      MedicalRegistryEntryChange source) {
    return switch (source) {
      case FullMedicalRegistryEntryChange fullMedicalRegistryEntryChange ->
          Optional.of(fullMedicalRegistryEntryChange.getProfessionInformation());
      case PartialMedicalRegistryEntryChange ignored -> Optional.empty();
    };
  }

  private void updateOrConfirmProfessional(
      MedicalRegistryEntryChange sourceEntry,
      MedicalRegistryProcedure targetEntry,
      ProfessionalReferencePersonDto professionalReferencePerson) {
    Optional<Professional> optionalProfessional = targetEntry.getOptionalProfessional();

    if (optionalProfessional.isEmpty()) {
      Professional professional = sourceEntry.getProfessional();
      targetEntry.addRelatedPerson(professional);
      updateOrConfirmProfessional(professional, professional, professionalReferencePerson);
    } else {
      Professional existingProfessional = optionalProfessional.get();
      UUID previousPersonCentralFileState = existingProfessional.getCentralFileStateId();

      updateOrConfirmProfessional(
          sourceEntry.getProfessional(), existingProfessional, professionalReferencePerson);

      documentPreviousPersonCentralFileStateIfNecessary(
          sourceEntry,
          previousPersonCentralFileState,
          existingProfessional.getCentralFileStateId());
    }
  }

  private static void documentPreviousPersonCentralFileStateIfNecessary(
      MedicalRegistryEntryChange entry,
      UUID previousPersonCentralFileState,
      UUID newPersonCentralFileState) {
    if (!newPersonCentralFileState.equals(previousPersonCentralFileState)) {
      getLatestMedicalRegistryEntryChangeProgressEntry(entry)
          .setPreviousPersonFileStateId(previousPersonCentralFileState);
    }
  }

  private static SystemProgressEntry getLatestMedicalRegistryEntryChangeProgressEntry(
      MedicalRegistryEntryChange medicalRegistryEntryChange) {
    return medicalRegistryEntryChange.getProgressEntries().stream()
        .filter(SystemProgressEntry.class::isInstance)
        .map(SystemProgressEntry.class::cast)
        .filter(MedicalRegistryService::isMedicalRegistryEntryChangeProgressEntry)
        .max(Comparator.comparing(ProgressEntry::getCreatedAt).thenComparing(ProgressEntry::getId))
        .orElseThrow(IllegalStateException::new);
  }

  private static boolean isMedicalRegistryEntryChangeProgressEntry(
      SystemProgressEntry progressEntry) {
    return MEDICAL_REGISTRY_ENTRY_CHANGE_PROGRESS_ENTRY_TYPES.contains(
        progressEntry.getSystemProgressEntryType());
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

  private void updateOrConfirmPractice(
      MedicalRegistryEntryChange sourceEntry,
      MedicalRegistryProcedure targetEntry,
      PracticeReferenceFacilityDto practiceReferenceFacility) {
    sourceEntry.getRelatedFacilities().stream()
        .collect(StreamUtil.toSingleOptionalElement())
        .ifPresent(
            sourcePractice -> {
              Practice existingPractice =
                  facilityService
                      .findTargetPractice(
                          targetEntry.getRelatedFacilities(), practiceReferenceFacility)
                      .orElse(null);

              if (existingPractice == null) {
                targetEntry.addRelatedFacility(sourcePractice);
                updateOrConfirmPractice(sourcePractice, sourcePractice, practiceReferenceFacility);
              } else {
                UUID previousFacilityFileState = existingPractice.getCentralFileStateId();
                updateOrConfirmPractice(
                    sourcePractice, existingPractice, practiceReferenceFacility);

                documentPreviousFacilityCentralFileStateIfNecessary(
                    sourceEntry,
                    previousFacilityFileState,
                    existingPractice.getCentralFileStateId());
              }
            });
  }

  private static void documentPreviousFacilityCentralFileStateIfNecessary(
      MedicalRegistryEntryChange entry, UUID previousFacilityFileState, UUID newFacilityFileState) {
    if (!newFacilityFileState.equals(previousFacilityFileState)) {
      getLatestMedicalRegistryEntryChangeProgressEntry(entry)
          .setPreviousFacilityFileStateId(previousFacilityFileState);
    }
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
      return medicalRegistryProcedureRepository.findExistingExternalIds(candidates);
    }
  }

  public void deleteProcedure(MedicalRegistryProcedure medicalRegistryProcedure) {
    medicalRegistryProcedure.updateProcedureStatus(ProcedureStatus.CLOSED, clock, auditLogger);
    procedureDeletionService.deleteAndWriteToCemetery(medicalRegistryProcedure);
  }

  private void addSystemProgressEntry(
      MedicalRegistryEntryChange medicalRegistryEntry, TriggerType triggerType) {
    addSystemProgressEntry(
        medicalRegistryEntry, medicalRegistryEntry.getTypeOfChange(), triggerType);
  }

  private void addSystemProgressEntry(
      MedicalRegistryProcedure medicalRegistryEntry,
      TypeOfChange typeOfChange,
      TriggerType triggerType) {
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            mapToSystemProgressEntryType(typeOfChange).name(), triggerType);

    progressEntryService.addSystemProgressEntry(medicalRegistryEntry, progressEntry);
  }

  private void addSystemProgressEntryFile(
      MedicalRegistryEntryChange procedure, DocumentData document, TriggerType triggerType) {
    String description = document.description();
    SystemProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            MedicalRegistrySystemProgressEntryType.DOCUMENT_UPLOAD.name(),
            description,
            triggerType,
            Optional.ofNullable(document.keyDocumentType()).map(Enum::name).orElse(null));
    progressEntryService.addSystemProgressEntry(
        procedure, progressEntry, withCurrentTimestamp(document.file()));
  }

  private void addSystemProgressEntryAboutRequestForWrittenConfirmationIfNecessary(
      MedicalRegistryEntryChange medicalRegistryEntry, TriggerType triggerType) {
    if (medicalRegistryEntry.isRequestForWrittenConfirmation()) {
      SystemProgressEntry systemProgressEntry =
          SystemProgressEntryFactory.createSystemProgressEntry(
              MedicalRegistrySystemProgressEntryType.REQUEST_FOR_WRITTEN_CONFIRMATION.name(),
              "Meldebestätigung angefordert",
              triggerType);
      progressEntryService.addSystemProgressEntry(medicalRegistryEntry, systemProgressEntry);
    }
  }

  private Image withCurrentTimestamp(Image image) {
    ImageMetaData metaData = new ImageMetaData();
    metaData.setCreatedDate(Instant.now(clock));
    image.addMetaData(metaData);
    return image;
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

    replaceProgressEntries(target, merge(target.getProgressEntries(), source.getProgressEntries()));
  }

  private static void replaceProgressEntries(
      MedicalRegistryEntry target, List<ProgressEntry> progressEntries) {
    target.getProgressEntries().clear();
    target.getProgressEntries().addAll(progressEntries);
  }

  private static List<ProgressEntry> merge(
      List<ProgressEntry> targetProgressEntries, List<ProgressEntry> sourceProgressEntries) {
    List<ProgressEntry> finalProgressEntries = new ArrayList<>();

    Stream.concat(targetProgressEntries.stream(), sourceProgressEntries.stream())
        .filter(MedicalRegistryService::isCreatedProgressEntry)
        .min(Comparator.comparing(ProgressEntry::getCreatedAt).thenComparing(ProgressEntry::getId))
        .ifPresent(finalProgressEntries::add);

    finalProgressEntries.addAll(
        targetProgressEntries.stream()
            .filter(not(MedicalRegistryService::isCreatedProgressEntry))
            .toList());
    finalProgressEntries.addAll(
        sourceProgressEntries.stream()
            .filter(not(MedicalRegistryService::isCreatedProgressEntry))
            .toList());

    return finalProgressEntries;
  }

  private static boolean isCreatedProgressEntry(ProgressEntry progressEntry) {
    if (Hibernate.unproxy(progressEntry) instanceof SystemProgressEntry systemProgressEntry) {
      return BasicSystemProgressEntryType.CREATED
          .name()
          .equals(systemProgressEntry.getSystemProgressEntryType());
    }
    return false;
  }

  public GetMedicalRegistryEntries getProceduresOverview(
      GetMedicalRegistryProceduresPaginationOptions paginationOptions,
      GetMedicalRegistryProceduresFilterOptions filterOptions) {
    Page<MedicalRegistryProcedure> page =
        medicalRegistryProcedureRepository.findAll(
            MedicalRegistryProcedureOverviewSpecification.fromFilterOptions(filterOptions),
            ofSize(paginationOptions.pageSize()).withPage(paginationOptions.pageNumber()));

    Map<UUID, GetPersonFileStateResponse> resolvedRelatedPerson =
        personService.resolvePersonDetailsById(page);

    return new GetMedicalRegistryEntries(
        page.getTotalPages(),
        page.getTotalElements(),
        EntryMapper.mapToDto(page, resolvedRelatedPerson));
  }

  ConfirmInfo getConfirmInfo(MedicalRegistryEntryChange medicalRegistryEntryChange) {
    final Map<UUID, List<GetReferencePersonResponse>> matchingReferencePersonByCentralFileStateId =
        personService.searchReferencePersons(medicalRegistryEntryChange);

    final Map<GetReferencePersonResponse, List<UUID>> associatedFileStatesByReferencePerson =
        personService.getPersonFileStateIdsAssociatedWithReferencePersons(
            matchingReferencePersonByCentralFileStateId.values().stream()
                .flatMap(Collection::stream)
                .distinct()
                .toList());

    final List<GetReferencePersonResponse> referencePersonsForApplicant =
        matchingReferencePersonByCentralFileStateId.get(
            medicalRegistryEntryChange.getProfessional().getCentralFileStateId());
    final Map<GetReferencePersonResponse, List<MedicalRegistryEntry>> procedureByReferencePersonId =
        getProceduresByReferencePersons(
            referencePersonsForApplicant, associatedFileStatesByReferencePerson);

    if (medicalRegistryEntryChange instanceof FullMedicalRegistryEntryChange) {
      referencePersonsForApplicant.forEach(
          referencePerson -> procedureByReferencePersonId.putIfAbsent(referencePerson, List.of()));
    }

    final List<MedicalRegistryEntry> targetProcedures =
        procedureByReferencePersonId.values().stream()
            .flatMap(Collection::stream)
            .distinct()
            .toList();

    final List<MedicalRegistryProcedure> involvedProcedures =
        Stream.concat(targetProcedures.stream(), Stream.of(medicalRegistryEntryChange)).toList();

    final Map<UUID, GetPersonFileStateResponse> resolvedPersonDetails =
        personService.resolvePersonDetailsById(involvedProcedures);
    final Map<UUID, FacilityDetails> resolvedFacilityDetails =
        facilityService.resolveFacilityDetailsById(involvedProcedures);

    return new ConfirmInfo(
        facilityService.searchReferenceFacility(medicalRegistryEntryChange),
        procedureByReferencePersonId,
        getEmployeeChoiceByProcedure(
            medicalRegistryEntryChange,
            targetProcedures,
            matchingReferencePersonByCentralFileStateId,
            associatedFileStatesByReferencePerson,
            resolvedPersonDetails),
        resolvedPersonDetails,
        resolvedFacilityDetails);
  }

  private Map<MedicalRegistryProcedure, List<EmployeeChoice>> getEmployeeChoiceByProcedure(
      MedicalRegistryEntryChange source,
      List<MedicalRegistryEntry> targets,
      Map<UUID, List<GetReferencePersonResponse>> matchingReferencePersonByCentralFileStateId,
      Map<GetReferencePersonResponse, List<UUID>> associatedFileStatesByReferencePerson,
      Map<UUID, GetPersonFileStateResponse> resolvedPersonDetails) {
    return targets.stream()
        .collect(
            StreamUtil.toLinkedHashMap(
                Function.identity(),
                procedure ->
                    getEmployeeChoices(
                        source,
                        procedure,
                        matchingReferencePersonByCentralFileStateId,
                        associatedFileStatesByReferencePerson,
                        resolvedPersonDetails)));
  }

  private List<EmployeeChoice> getEmployeeChoices(
      MedicalRegistryEntryChange source,
      MedicalRegistryProcedure target,
      Map<UUID, List<GetReferencePersonResponse>> matchingReferencePersonByCentralFileStateId,
      Map<GetReferencePersonResponse, List<UUID>> associatedFileStatesByReferencePerson,
      Map<UUID, GetPersonFileStateResponse> resolvedPersonDetailsById) {
    final Map<UUID, UUID> existingEmployeeIdsByCentralFileStateId =
        target.getEmployees().stream()
            .collect(
                StreamUtil.toLinkedHashMap(
                    RelatedPerson::getCentralFileStateId,
                    SequencedBaseEntityWithExternalId::getExternalId));

    return source.getEmployees().stream()
        .map(
            employeeChange ->
                getEmployeeChoice(
                    employeeChange,
                    matchingReferencePersonByCentralFileStateId,
                    associatedFileStatesByReferencePerson,
                    existingEmployeeIdsByCentralFileStateId,
                    resolvedPersonDetailsById))
        .toList();
  }

  private EmployeeChoice getEmployeeChoice(
      EmployeeChange employeeChange,
      Map<UUID, List<GetReferencePersonResponse>> matchingReferencePersonByCentralFileStateId,
      Map<GetReferencePersonResponse, List<UUID>> associatedFileStatesByReferencePerson,
      Map<UUID, UUID> existingEmployeeIdsByCentralFileStateId,
      Map<UUID, GetPersonFileStateResponse> resolvedPersonDetailsById) {
    final GetPersonFileStateResponse employeeChangeDetails =
        resolvedPersonDetailsById.get(employeeChange.getCentralFileStateId());
    final List<GetReferencePersonResponse> matchingReferencePersons =
        matchingReferencePersonByCentralFileStateId.get(employeeChange.getCentralFileStateId());

    final List<PersonCandidate> personCandidates =
        getPersonCandidatesFromExistingPersons(
            employeeChange,
            existingEmployeeIdsByCentralFileStateId,
            matchingReferencePersons,
            associatedFileStatesByReferencePerson);

    final boolean executionWouldLeadToConflict =
        employeeChange.getEmployeeChangeType() == EmployeeChangeType.ADD
            && exactSamePersonExists(employeeChangeDetails, matchingReferencePersons);

    if (!executionWouldLeadToConflict) {
      personCandidates.add(
          new PersonCandidate(
              null,
              null,
              employeeChangeDetails.firstName(),
              employeeChangeDetails.lastName(),
              employeeChangeDetails.dateOfBirth()));
    }
    return new EmployeeChoice(employeeChange, personCandidates);
  }

  private boolean exactSamePersonExists(
      PersonDetails person, List<? extends PersonDetails> existingPersons) {
    return existingPersons.stream()
        .anyMatch(existingPerson -> hasSameKeyAttributes(person, existingPerson));
  }

  private boolean hasSameKeyAttributes(PersonDetails personA, PersonDetails personB) {
    return Objects.equals(personB.firstName(), personA.firstName())
        && Objects.equals(personB.lastName(), personA.lastName())
        && Objects.equals(personB.dateOfBirth(), personA.dateOfBirth());
  }

  private List<PersonCandidate> getPersonCandidatesFromExistingPersons(
      EmployeeChange employeeChange,
      Map<UUID, UUID> existingEmployeeIdsByCentralFileStateId,
      List<GetReferencePersonResponse> matchingReferencePersons,
      Map<GetReferencePersonResponse, List<UUID>> associatedFileStatesByReferencePerson) {
    return matchingReferencePersons.stream()
        .map(
            matchingReferencePerson ->
                toPersonCandidate(
                    matchingReferencePerson,
                    employeeChange.getEmployeeChangeType(),
                    existingEmployeeIdsByCentralFileStateId,
                    associatedFileStatesByReferencePerson))
        .filter(Objects::nonNull)
        .collect(Collectors.toList());
  }

  private PersonCandidate toPersonCandidate(
      GetReferencePersonResponse matchingReferencePerson,
      EmployeeChangeType employeeChangeType,
      Map<UUID, UUID> existingEmployeeIdsByCentralFileStateId,
      Map<GetReferencePersonResponse, List<UUID>> associatedFileStatesByReferencePerson) {
    final UUID associatedCentralFileStateInProcedure =
        associatedFileStatesByReferencePerson.get(matchingReferencePerson).stream()
            .filter(existingEmployeeIdsByCentralFileStateId.keySet()::contains)
            .findFirst()
            .orElse(null);

    final boolean isRemoveNonExistingPerson =
        employeeChangeType == EmployeeChangeType.REMOVE
            && associatedCentralFileStateInProcedure == null;
    if (isRemoveNonExistingPerson) {
      return null;
    } else {
      return new PersonCandidate(
          matchingReferencePerson.id(),
          existingEmployeeIdsByCentralFileStateId.get(associatedCentralFileStateInProcedure),
          matchingReferencePerson.firstName(),
          matchingReferencePerson.lastName(),
          matchingReferencePerson.dateOfBirth());
    }
  }

  private Map<GetReferencePersonResponse, List<MedicalRegistryEntry>>
      getProceduresByReferencePersons(
          List<GetReferencePersonResponse> referencePersons,
          Map<GetReferencePersonResponse, List<UUID>> associatedFilesStatesByReferencePerson) {
    final Map<UUID, GetReferencePersonResponse> referencePersonByPersonFileState =
        invertOneToMany(associatedFilesStatesByReferencePerson);

    final List<UUID> associatedFileStates =
        referencePersons.stream()
            .map(associatedFilesStatesByReferencePerson::get)
            .flatMap(Collection::stream)
            .toList();

    return medicalRegistryProcedureRepository
        .findByRelatedPersonsCentralFileStateIds(associatedFileStates, PersonType.PROFESSIONAL)
        .stream()
        .map(Hibernate::unproxy)
        .filter(MedicalRegistryEntry.class::isInstance)
        .map(MedicalRegistryEntry.class::cast)
        .filter(entry -> entry.getProcedureStatus() == ProcedureStatus.OPEN)
        .collect(
            StreamUtil.groupingBy(
                procedure ->
                    referencePersonByPersonFileState.get(
                        procedure.getProfessional().getCentralFileStateId())));
  }

  private static <One, Many> Map<Many, One> invertOneToMany(Map<One, List<Many>> oneToManyMap) {
    return oneToManyMap.entrySet().stream()
        .flatMap(
            oneToManyEntry ->
                oneToManyEntry.getValue().stream()
                    .map(listValue -> Map.entry(oneToManyEntry.getKey(), listValue)))
        .collect(StreamUtil.toLinkedHashMap(Map.Entry::getValue, Map.Entry::getKey));
  }

  public record ConfirmInfo(
      List<GetReferenceFacilityResponse> matchingReferenceFacilities,
      Map<GetReferencePersonResponse, List<MedicalRegistryEntry>>
          proceduresByMatchingReferencePerson,
      Map<MedicalRegistryProcedure, List<EmployeeChoice>> employeeChoiceByProcedure,
      Map<UUID, GetPersonFileStateResponse> resolvedPersonDetails,
      Map<UUID, FacilityDetails> resolvedFacilityDetails) {}

  public record EmployeeChoice(
      EmployeeChange employeeChange, List<PersonCandidate> personCandidates) {}

  public record PersonCandidate(
      UUID referencePersonId,
      UUID employeeId,
      String firstName,
      String lastName,
      LocalDate dateOfBirth) {}
}
