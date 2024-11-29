/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection;

import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.PutFacilityRequest;
import de.eshg.base.feature.BaseFeature;
import de.eshg.base.feature.BaseFeatureTogglesApi;
import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.checklist.ChecklistService;
import de.eshg.inspection.checklist.api.ChecklistDto;
import de.eshg.inspection.checklist.api.GetChecklistsResponse;
import de.eshg.inspection.checklist.api.update.UpdateChecklistDto;
import de.eshg.inspection.checklist.api.update.UpdateChecklistRequest;
import de.eshg.inspection.checklist.api.update.UpdateChecklistResponse;
import de.eshg.inspection.checklist.persistence.Checklist;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersion;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersionRepository;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.inspection.api.FinalizeInspectionRequest;
import de.eshg.inspection.inspection.api.InspectionAvailableCLDVersionsResponse;
import de.eshg.inspection.inspection.api.InspectionAvailablePLDRevisionsResponse;
import de.eshg.inspection.inspection.api.InspectionDto;
import de.eshg.inspection.inspection.api.InspectionPhase;
import de.eshg.inspection.inspection.api.InspectionResult;
import de.eshg.inspection.inspection.api.InspectionSyncFileStateRequest;
import de.eshg.inspection.inspection.api.InspectionType;
import de.eshg.inspection.inspection.api.StartInspectionRequest;
import de.eshg.inspection.inspection.api.UpdateInspectionAddResourceRequest;
import de.eshg.inspection.inspection.api.UpdateInspectionModifyInventoryRequest;
import de.eshg.inspection.inspection.api.UpdateInspectionRequest;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionAppointment;
import de.eshg.inspection.inspection.persistence.InspectionRelatedFacility;
import de.eshg.inspection.inspection.persistence.InspectionRelatedFacilityRepository;
import de.eshg.inspection.inspection.persistence.InspectionRepository;
import de.eshg.inspection.inspection.persistence.InspectionTask;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.objecttype.persistence.ObjectTypeRepository;
import de.eshg.inspection.packlist.PacklistService;
import de.eshg.inspection.packlist.api.GetPacklistsResponse;
import de.eshg.inspection.packlist.api.PacklistDto;
import de.eshg.inspection.packlist.api.UpdatePacklistElementRequest;
import de.eshg.inspection.packlist.persistence.Packlist;
import de.eshg.inspection.packlist.persistence.PacklistElement;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionRevision;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionRevisionRepository;
import de.eshg.inspection.util.Holder;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory;
import de.eshg.lib.procedure.domain.model.FacilityType;
import de.eshg.lib.procedure.domain.model.InboxProcedure;
import de.eshg.lib.procedure.domain.model.InboxProcedureStatus;
import de.eshg.lib.procedure.domain.model.InboxProgressEntry;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.ProcessedInboxProgressEntry;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.lib.procedure.domain.model.TriggerType;
import de.eshg.lib.procedure.inbox.InboxProcedureService;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class InspectionService {
  private static final Logger log = LoggerFactory.getLogger(InspectionService.class);

  private final InspectionRepository inspectionRepository;
  private final InspectionRelatedFacilityRepository inspectionRelatedFacilityRepository;
  private final ObjectTypeRepository objectTypeRepository;
  private final ChecklistDefinitionVersionRepository cldVersionRepository;
  private final PacklistDefinitionRevisionRepository pldRevisionRepository;
  private final InspectionMapper inspectionMapper;
  private final InspectionUpdater inspectionUpdater;
  private final InspectionFinalizer inspectionFinalizer;
  private final ChecklistService checklistService;
  private final Clock clock;
  private final AuditLogger auditLogger;
  private final FacilityClient facilityClient;
  private final PacklistService packlistService;
  private final InboxProcedureService inboxProcedureService;
  private final BaseFeatureTogglesApi baseFeatureTogglesApi;

  public InspectionService(
      InspectionRepository inspectionRepository,
      InspectionRelatedFacilityRepository inspectionRelatedFacilityRepository,
      ObjectTypeRepository objectTypeRepository,
      ChecklistDefinitionVersionRepository cldVersionRepository,
      PacklistDefinitionRevisionRepository pldRevisionRepository,
      InspectionMapper inspectionMapper,
      InspectionUpdater inspectionUpdater,
      InspectionFinalizer inspectionFinalizer,
      ChecklistService checklistService,
      Clock clock,
      AuditLogger auditLogger,
      FacilityClient facilityClient,
      PacklistService packlistService,
      InboxProcedureService inboxProcedureService,
      BaseFeatureTogglesApi baseFeatureTogglesApi) {
    this.inspectionRepository = inspectionRepository;
    this.inspectionRelatedFacilityRepository = inspectionRelatedFacilityRepository;
    this.objectTypeRepository = objectTypeRepository;
    this.cldVersionRepository = cldVersionRepository;
    this.pldRevisionRepository = pldRevisionRepository;
    this.inspectionMapper = inspectionMapper;
    this.inspectionUpdater = inspectionUpdater;
    this.inspectionFinalizer = inspectionFinalizer;
    this.checklistService = checklistService;
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.facilityClient = facilityClient;
    this.packlistService = packlistService;
    this.inboxProcedureService = inboxProcedureService;
    this.baseFeatureTogglesApi = baseFeatureTogglesApi;
  }

  public InspectionDto startInspection(UUID externalId, StartInspectionRequest request) {
    Inspection inspection = loadInspection(externalId);
    if (inspection.getProcedureStatus() != ProcedureStatus.DRAFT) {
      throw new BadRequestException(ErrorCode.CONFLICT, "This procedure is not in status DRAFT.");
    }

    Facility facility = inspection.getFacility();
    if (facility.getObjectType() == null) {
      if (request.objectTypeId() == null) {
        throw new BadRequestException(
            ErrorCode.BAD_REQUEST,
            "This procedures facility doesn't have an object type and none was provided.");
      }
      facility.setObjectType(loadObjectType(request.objectTypeId()));
    }

    inspection.setType(request.type());
    inspection.setModifiedBy(CurrentUserHelper.getCurrentUserId());
    inspection.setPhase(InspectionPhase.PLANNING);
    inspection.updateProcedureStatus(ProcedureStatus.IN_PROGRESS, clock, auditLogger);

    // create planning task (without appointment)
    InspectionTask planningTask = InspectionTask.newPlanningTask(request.assigneeId(), clock);
    inspection.addTask(planningTask);

    addManualProgressEntry(request.progressEntryText(), inspection);

    // ISSUE-1109: if there's exactly one CLD version for the facility's objectType,
    // then use it for the new inspection
    ObjectType objectType = facility.getObjectType();
    List<ChecklistDefinitionVersion> versions =
        cldVersionRepository.findNewestCLDVersionsForObjectType(objectType);
    if (versions.size() == 1) {
      inspectionMapper.addChecklistVersionToInspection(versions.getFirst(), inspection);
    }

    return inspectionMapper.mapToDto(inspection);
  }

  public Inspection createDraftInspection(Facility facility) {
    UUID centralFileStateId = facility.getCentralFileStateId();
    verifyAllInspectionsClosed(centralFileStateId);

    Inspection inspection = new Inspection();
    inspection.setPhase(InspectionPhase.NEW);
    inspection.setType(InspectionType.INITIAL);
    inspection.setModifiedBy(CurrentUserHelper.getCurrentUserId());

    inspection.updateProcedureStatus(ProcedureStatus.DRAFT, clock, auditLogger);

    inspection.setProcedureType(ProcedureType.INSPECTION);
    inspection.setResult(InspectionResult.OPEN);

    InspectionRelatedFacility inspectionRelatedFacility = new InspectionRelatedFacility();
    inspectionRelatedFacility.setCentralFileStateId(centralFileStateId);
    inspectionRelatedFacility.setFacilityType(FacilityType.INSPECTION);
    inspectionRelatedFacility.setProcedure(inspection);
    inspectionRelatedFacility.setFacility(facility);
    inspection.addRelatedFacility(inspectionRelatedFacility);

    Inspection savedInspection = inspectionRepository.saveAndFlush(inspection);

    log.info(
        "Saved a new inspection, id={}, externalId={}",
        savedInspection.getId(),
        savedInspection.getExternalId());

    return savedInspection;
  }

  public InspectionDto updateInspection(UUID externalId, UpdateInspectionRequest request) {
    Inspection modified;
    if (request.lock() != null) {
      // If a lock is set in request, all other updates in this request will be ignored
      Inspection inspection = loadInspectionWithLock(externalId);
      modified = inspectionUpdater.lockInspection(inspection, request.lock());
    } else {
      Inspection inspection = loadInspectionForUpdate(externalId);
      modified = inspectionUpdater.updateInspection(inspection, request);
    }
    return inspectionMapper.mapToDto(modified);
  }

  public InspectionDto modifyInventory(
      UUID externalId, UpdateInspectionModifyInventoryRequest request) {
    Inspection inspection = loadInspectionForUpdate(externalId);
    Inspection modified = inspectionUpdater.modifyInventory(inspection, request);
    return inspectionMapper.mapToDto(modified);
  }

  public InspectionDto addResource(UUID externalId, UpdateInspectionAddResourceRequest request) {
    Inspection inspection = loadInspectionForUpdate(externalId);
    Inspection modified = inspectionUpdater.addResource(inspection, request);
    return inspectionMapper.mapToDto(modified);
  }

  public InspectionDto deleteResource(UUID externalId, UUID resourceId) {
    Inspection inspection = loadInspectionForUpdate(externalId);
    Inspection modified = inspectionUpdater.deleteResource(inspection, resourceId);
    return inspectionMapper.mapToDto(modified);
  }

  public Inspection loadInspection(UUID externalId) {
    return inspectionRepository
        .findByExternalId(externalId)
        .orElseThrow(() -> new NotFoundException("Inspection not found"));
  }

  private Inspection loadInspectionWithLock(UUID externalId) {
    return inspectionRepository
        .findByExternalIdForUpdate(externalId)
        .orElseThrow(() -> new NotFoundException("Inspection not found"));
  }

  public Inspection loadInspectionForUpdate(UUID externalId) {
    Inspection inspection = loadInspectionWithLock(externalId);
    UUID currentUserId = CurrentUserHelper.getCurrentUserId();
    if (inspection.getLockedBy() != null && !inspection.getLockedBy().equals(currentUserId)) {
      throw new BadRequestException(
          ErrorCode.LOCKED, "The inspection is locked by a different user.");
    }
    return inspection;
  }

  public InspectionDto loadInspectionDTO(UUID externalId) {
    Inspection inspection = loadInspection(externalId);
    return inspectionMapper.mapToDto(inspection);
  }

  public Inspection findNewestOpenInspectionForFacility(Facility facility) {
    return inspectionRepository.findNewestOpenInspectionForFacility(facility);
  }

  public Inspection findNewestClosedInspectionForFacility(Facility facility) {
    return inspectionRepository.findNewestClosedInspectionForFacility(facility);
  }

  public InspectionAvailableCLDVersionsResponse getAvailableCLDs(UUID externalId) {
    Inspection inspection = loadInspection(externalId);
    ObjectType objectType = inspection.getFacility().getObjectType();

    if (objectType != null) {
      // find all CLDVs for ObjectType, but don't include those non-core CLDVs for which its CLD is
      // already selected. Note: core CLDVs are always included.
      final Set<UUID> existingNonCoreDefinitions = new HashSet<>();
      boolean executionPhaseWasReached =
          inspection.getPhase() != InspectionPhase.NEW
              && inspection.getPhase() != InspectionPhase.PLANNING
              && inspection.getPhase() != InspectionPhase.READY_FOR_EXECUTION;

      // in case we were in EXECUTION phase, do include non-core cldvs even if a cld from the db is
      // non-expandable, because when we went into EXECUTION, there was no non-expandable cldv. So
      // in that case we need to check whether an already existing checklist is non-expandable
      // instead
      Holder<Boolean> includeNonCoreCldvs = new Holder<>(executionPhaseWasReached);

      if (!executionPhaseWasReached) {
        existingNonCoreDefinitions.addAll(
            inspection.getChecklists().stream()
                .map(cl -> cl.getChecklistDefinitionVersion().getChecklistDefinition())
                .filter(definition -> !definition.isCoreChecklist())
                .map(GloballyUniqueEntityBase::getId)
                .collect(Collectors.toSet()));
      } else {
        inspection
            .getChecklists()
            .forEach(
                cl -> {
                  boolean clIsCoreChecklist =
                      cl.getChecklistDefinitionVersion().getChecklistDefinition().isCoreChecklist();
                  boolean clIsExpandable = cl.getChecklistDefinitionVersion().isExpandable();
                  if (!clIsCoreChecklist) {
                    existingNonCoreDefinitions.add(
                        cl.getChecklistDefinitionVersion().getChecklistDefinition().getId());
                  } else if (!clIsExpandable && includeNonCoreCldvs.get().equals(Boolean.TRUE)) {
                    includeNonCoreCldvs.set(false);
                  }
                });
      }

      List<ChecklistDefinitionVersion> entityVersions =
          cldVersionRepository.findNewestCLDVersionsForObjectTypeWithExclusion(
              objectType, existingNonCoreDefinitions);

      return inspectionMapper.mapCldvsToResponse(entityVersions, includeNonCoreCldvs.get());
    } else {
      return new InspectionAvailableCLDVersionsResponse(List.of(), List.of(), true);
    }
  }

  public GetChecklistsResponse getChecklists(UUID inspectionExternalId) {
    Inspection inspection = this.loadInspection(inspectionExternalId);
    return checklistService.getChecklists(inspection);
  }

  public UpdateChecklistResponse updateChecklist(
      UUID externalId, UUID checklistId, UpdateChecklistRequest request) {
    return updateChecklist(externalId, checklistId, request.checklist());
  }

  public UpdateChecklistResponse updateChecklist(
      UUID externalId, UUID checklistId, UpdateChecklistDto updateChecklist) {
    Inspection inspection = loadInspectionForUpdate(externalId);

    if (inspection.getPhase() != InspectionPhase.READY_FOR_EXECUTION
        && inspection.getPhase() != InspectionPhase.EXECUTING) {
      throw new BadRequestException(
          "Updating checklist is not allowed. Inspection has to be in phase READY_FOR_EXECUTION or EXECUTING.");
    }

    Checklist checklist =
        inspection.getChecklists().stream()
            .filter(cl -> cl.getId().equals(checklistId))
            .findFirst()
            .orElseThrow(
                () -> new NotFoundException("This checklist is not part of this inspection"));

    inspectionUpdater.advanceToExecutingPhase(inspection);

    ChecklistDto checklistDto = checklistService.updateChecklist(checklist, updateChecklist);
    return new UpdateChecklistResponse(checklistDto);
  }

  public InspectionAvailablePLDRevisionsResponse getAvailablePLDs(UUID externalId) {
    Inspection inspection = loadInspection(externalId);
    ObjectType objectType = inspection.getFacility().getObjectType();

    if (objectType != null) {
      final Set<UUID> availablePacklistDefinitions =
          inspection.getPacklists().stream()
              .map(pl -> pl.getPacklistDefinitionRevision().getPacklistDefinition())
              .map(GloballyUniqueEntityBase::getId)
              .collect(Collectors.toSet());

      List<PacklistDefinitionRevision> entityVersions =
          pldRevisionRepository.findNewestPLDRevisionsForObjectTypeWithExclusion(
              objectType, availablePacklistDefinitions);

      return inspectionMapper.mapPldrsToResponse(entityVersions);
    } else {
      return new InspectionAvailablePLDRevisionsResponse(List.of());
    }
  }

  public GetPacklistsResponse getPacklists(UUID inspectionExternalId) {
    Inspection inspection = this.loadInspection(inspectionExternalId);

    return packlistService.getPacklists(inspection);
  }

  public PacklistDto checkPacklistElement(
      UUID inspectionExternalId,
      UUID packlistId,
      UUID packlistElementId,
      UpdatePacklistElementRequest request) {
    Inspection inspection = this.loadInspection(inspectionExternalId);

    Packlist packlist =
        inspection.getPacklists().stream()
            .filter(pl -> pl.getId().equals(packlistId))
            .findFirst()
            .orElseThrow(
                () -> new NotFoundException("This packlist is not part of this inspection"));

    PacklistElement packlistElement =
        packlist.getElements().stream()
            .filter(e -> e.getId().equals(packlistElementId))
            .findFirst()
            .orElseThrow(
                () -> new NotFoundException("This packlist element is not part of this packlist"));

    return packlistService.checkPacklistElement(packlistElement, request.checked());
  }

  public InspectionDto syncInspectionFacilityFileState(
      UUID inspectionExternalId, InspectionSyncFileStateRequest request) {
    Inspection inspection = loadInspectionForUpdate(inspectionExternalId);

    AddFacilityFileStateResponse baseResponse =
        facilityClient.syncFacilityFileState(
            inspection.getCentralFileStateId(), request.facilityVersion());

    inspection.getRelatedFacility().setCentralFileStateId(baseResponse.id());
    inspection.getFacility().setCentralFileStateId(baseResponse.id());

    ProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            "INSPECTION_FACILITY_SYNCED", TriggerType.EMPLOYEE);

    inspection.addProgressEntry(progressEntry);

    return inspectionMapper.mapToDto(inspection);
  }

  public InspectionDto updateFacilityFileStateAndReference(
      UUID inspectionExternalId, PutFacilityRequest request) {

    Inspection inspection = loadInspection(inspectionExternalId);

    AddFacilityFileStateResponse baseResponse =
        facilityClient.updateFacilityFileStateAndReference(
            inspection.getCentralFileStateId(), request);

    inspection.getRelatedFacility().setCentralFileStateId(baseResponse.id());
    inspection.getFacility().setCentralFileStateId(baseResponse.id());

    ProgressEntry progressEntry =
        SystemProgressEntryFactory.createSystemProgressEntry(
            "INSPECTION_FACILITY_UPDATED", TriggerType.EMPLOYEE);

    inspection.addProgressEntry(progressEntry);

    return inspectionMapper.mapToDto(inspection);
  }

  private ObjectType loadObjectType(UUID objectTypeId) {
    Optional<ObjectType> objectType = Optional.empty();
    if (objectTypeId != null) {
      objectType = objectTypeRepository.findById(objectTypeId);
      if (objectType.isEmpty()) {
        throw new BadRequestException("invalid objectTypeId");
      }
    }
    return objectType.orElse(null);
  }

  private void addManualProgressEntry(String progressEntryText, Inspection inspection) {
    if (StringUtils.isNotBlank(progressEntryText)) {
      ManualProgressEntry manualProgressEntry = new ManualProgressEntry();
      manualProgressEntry.setManualProgressEntryType(ManualProgressEntryType.NOTE);
      manualProgressEntry.setNote(progressEntryText);
      inspection.addProgressEntry(manualProgressEntry);
    }
  }

  private void verifyAllInspectionsClosed(UUID centralFileStateId) {
    List<UUID> relatedBaseFacilities =
        facilityClient.getFacilityFileStateIdsWithSameReferenceFacility(centralFileStateId);
    if (!relatedBaseFacilities.isEmpty() && inspectionOngoing(relatedBaseFacilities)) {
      throw new BadRequestException(
          ErrorCode.CONFLICT, "Procedure for this facility already exists.");
    }
  }

  private boolean inspectionOngoing(List<UUID> relatedFacilityFileStateIds) {
    return inspectionRelatedFacilityRepository
        .findAllByCentralFileStateIdIn(relatedFacilityFileStateIds)
        .stream()
        .anyMatch(
            inspectionRelatedFacility ->
                inspectionRelatedFacility.getProcedure().getProcedureStatus().isOpen());
  }

  public InspectionDto finalizeInspection(
      UUID externalId, FinalizeInspectionRequest request, MultipartFile signatureFile) {
    Inspection inspection = loadInspectionForUpdate(externalId);
    inspectionFinalizer.finalizeInspection(inspection, request, signatureFile);
    return inspectionMapper.mapToDto(inspection);
  }

  public InspectionDto approveInspection(UUID externalId) {
    Inspection inspection = loadInspectionForUpdate(externalId);
    inspectionFinalizer.approveInspection(inspection);
    return inspectionMapper.mapToDto(inspection);
  }

  public ResponseEntity<Resource> downloadReport(UUID reportId) {
    return inspectionFinalizer.downloadReport(reportId);
  }

  public void updateInspectionsWithChangedIntervals(
      ObjectType objectType, int intervalDifference, InspectionType inspectionType) {
    if (objectType.getStandardDuration() == null) {
      return;
    }

    List<InspectionAppointment> appointments =
        inspectionRepository.findInspectionAppointmentsToUpdate(objectType.getId(), inspectionType);

    for (InspectionAppointment appointment : appointments) {
      updateInspectionAppointmentWithChangedInterval(
          appointment, Duration.ofDays(intervalDifference), objectType.getStandardDuration());
    }
  }

  private void updateInspectionAppointmentWithChangedInterval(
      InspectionAppointment appointment, Duration difference, int standardDuration) {
    Instant newStart = appointment.getAppointmentStart().plus(difference);
    Instant newEnd = newStart.plus(Duration.ofHours(standardDuration));
    appointment.setAppointmentStart(newStart);
    appointment.setAppointmentEnd(newEnd);
  }

  public void linkInboxProcedure(UUID inboxProcedureId, Inspection inspection) {
    if (inboxProcedureId == null) return;

    Set<BaseFeature> features = baseFeatureTogglesApi.getFeatureToggles().enabledNewFeatures();
    if (!features.contains(BaseFeature.INBOX) && !features.contains(BaseFeature.INSPECTION_INBOX)) {
      throw new IllegalStateException(
          "Neither new features %s and %s is enabled"
              .formatted(BaseFeature.INBOX, BaseFeature.INSPECTION_INBOX));
    }

    InboxProcedure inboxProcedure;
    try {
      inboxProcedure = inboxProcedureService.getInboxProcedureOrThrow(inboxProcedureId);
    } catch (NotFoundException e) {
      log.error("Could not find inbox procedure {}", inboxProcedureId, e);
      throw new BadRequestException("Could not copy inbox procedure info to inspection procedure.");
    }

    if (inboxProcedure.getInboxProcedureStatus() != InboxProcedureStatus.OPEN) {
      log.error(
          "Inbox procedure {} has unexpected status {} (expected OPEN)",
          inboxProcedureId,
          inboxProcedure.getInboxProcedureStatus());
      throw new BadRequestException("Could not copy inbox procedure info to inspection procedure.");
    }

    ProcessedInboxProgressEntry processedInboxProgressEntry =
        createProcessedInboxProgressEntry(inboxProcedure, inspection.getId());
    inspection.addProgressEntry(processedInboxProgressEntry);
    inboxProcedure.updateInboxProcedureStatus(InboxProcedureStatus.CLOSED, clock);
  }

  private static ProcessedInboxProgressEntry createProcessedInboxProgressEntry(
      InboxProcedure inboxProcedure, Long inspectionId) {
    InboxProgressEntry inboxProgressEntry = inboxProcedure.getInboxProgressEntry();

    ProcessedInboxProgressEntry processedInboxProgressEntry = new ProcessedInboxProgressEntry();
    processedInboxProgressEntry.setInboxProgressEntryType(
        inboxProgressEntry.getInboxProgressEntryType());
    processedInboxProgressEntry.setMessageText(inboxProgressEntry.getMessageText());
    processedInboxProgressEntry.setSubject(inboxProgressEntry.getSubject());
    processedInboxProgressEntry.setInboxProcedure(inboxProcedure);
    processedInboxProgressEntry.setProcedureId(inspectionId);
    if (inboxProgressEntry.getFile() != null) {
      processedInboxProgressEntry.setFile(inboxProgressEntry.getFile().copy());
    }
    return processedInboxProgressEntry;
  }
}
