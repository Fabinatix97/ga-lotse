/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import static de.eshg.medicalregistry.Validator.asMapper;
import static de.eshg.medicalregistry.mapper.ProcedureMapper.mapToSystemProgressEntryType;
import static java.util.function.Predicate.not;
import static org.springframework.data.domain.PageRequest.ofSize;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.BasicSystemProgressEntryType;
import de.eshg.lib.procedure.domain.model.Image;
import de.eshg.lib.procedure.domain.model.ImageMetaData;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
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
import de.eshg.medicalregistry.business.model.DocumentData;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
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
    UUID personId = personService.createPersonInCentralFile(createProcedureRequest.applicant());
    UUID facilityId =
        facilityService.createFacilityInCentralFile(
            getPractice(createProcedureRequest), createProcedureRequest.applicant());

    MedicalRegistryEntryChange medicalRegistryEntry =
        CreationMapper.mapToDomain(createProcedureRequest, triggerType, personId, facilityId);

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
            Collectors.toMap(
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

  private Optional<Boolean> getIsEmployeesEmployed(MedicalRegistryEntryChange source) {
    return switch (source) {
      case FullMedicalRegistryEntryChange fullMedicalRegistryEntryChange ->
          Optional.of(fullMedicalRegistryEntryChange.isEmployeesEmployed());
      case PartialMedicalRegistryEntryChange ignored -> Optional.empty();
    };
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
    Professional existingProfessional =
        targetEntry.getRelatedPersons().stream()
            .collect(StreamUtil.toSingleOptionalElement())
            .orElse(null);

    if (existingProfessional == null) {
      Professional professional = sourceEntry.getProfessional();
      targetEntry.addRelatedPerson(professional);
      updateOrConfirmProfessional(professional, professional, professionalReferencePerson);
    } else {
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
    getIsEmployeesEmployed(source).ifPresent(target::setEmployeesEmployed);

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
}
