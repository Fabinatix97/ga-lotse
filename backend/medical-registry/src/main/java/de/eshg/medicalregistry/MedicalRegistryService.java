/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import static de.eshg.medicalregistry.Validator.asMapper;
import static de.eshg.medicalregistry.mapper.ProcedureMapper.mapToSystemProgressEntryType;
import static org.springframework.data.domain.PageRequest.ofSize;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.centralfile.api.person.GetPersonFileStateResponse;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.Image;
import de.eshg.lib.procedure.domain.model.ImageMetaData;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
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
import de.eshg.validation.ValidationUtil;
import java.time.Clock;
import java.time.Instant;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.apache.commons.collections4.ListUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class MedicalRegistryService {
  private static final Logger log = LoggerFactory.getLogger(MedicalRegistryService.class);
  private static final Set<TypeOfChange> DEREGISTRATION_TYPE_OF_CHANGES =
      EnumSet.of(TypeOfChange.DEREGISTRATION, TypeOfChange.RELOCATION);

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
        draftMedicalRegistryEntry.getProfessional(),
        medicalRegistryEntry,
        professionalReferencePerson);

    updateOrConfirmPractice(
        draftMedicalRegistryEntry.getRelatedFacilities(),
        medicalRegistryEntry,
        practiceReferenceFacility);

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

    source.getProgressEntries().forEach(target::addProgressEntry);
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
