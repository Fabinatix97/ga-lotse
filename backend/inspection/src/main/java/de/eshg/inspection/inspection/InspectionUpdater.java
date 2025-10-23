/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection;

import static de.eshg.inspection.client.UserClient.UNKNOWN_USER;
import static de.eshg.inspection.inspection.InspectionUtils.checkInspectionIsNotClosed;
import static de.eshg.lib.keycloak.EmployeePermissionRole.INSPECTION_LEADER;
import static java.util.Optional.ofNullable;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.calendar.CalendarApi;
import de.eshg.base.calendar.CalendarEventApi;
import de.eshg.base.calendar.api.BusinessCaseEventRequest;
import de.eshg.base.calendar.api.DetailedEvent;
import de.eshg.base.calendar.api.EventTimeData;
import de.eshg.base.calendar.api.ResourceCalendar;
import de.eshg.base.inventory.InventoryApi;
import de.eshg.base.inventory.api.BookInventoryItemRequest;
import de.eshg.base.inventory.api.InventoryItemBookingEntry;
import de.eshg.base.resource.ResourceApi;
import de.eshg.base.resource.api.ResourceDto;
import de.eshg.domain.model.BaseEntity;
import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.inspection.checklist.ChecklistService;
import de.eshg.inspection.checklist.persistence.Checklist;
import de.eshg.inspection.checklist.persistence.ChecklistSection;
import de.eshg.inspection.checklist.persistence.element.ChecklistElement;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersion;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersionRepository;
import de.eshg.inspection.client.CalendarClient;
import de.eshg.inspection.client.UserClient;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.inspection.api.FollowupType;
import de.eshg.inspection.inspection.api.InspectionAnnouncementDto;
import de.eshg.inspection.inspection.api.InspectionAnnouncementType;
import de.eshg.inspection.inspection.api.InspectionPhase;
import de.eshg.inspection.inspection.api.InspectionResult;
import de.eshg.inspection.inspection.api.UpdateInspectionAddResourceRequest;
import de.eshg.inspection.inspection.api.UpdateInspectionAppointmentDto;
import de.eshg.inspection.inspection.api.UpdateInspectionModifyInventoryRequest;
import de.eshg.inspection.inspection.api.UpdateInspectionRequest;
import de.eshg.inspection.inspection.api.UpdateInspectionTravelTimeDto;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionAnnouncement;
import de.eshg.inspection.inspection.persistence.InspectionAppointment;
import de.eshg.inspection.inspection.persistence.InspectionInventory;
import de.eshg.inspection.inspection.persistence.InspectionRepository;
import de.eshg.inspection.inspection.persistence.InspectionResource;
import de.eshg.inspection.inspection.persistence.InspectionTask;
import de.eshg.inspection.inspection.persistence.InspectionTravelTime;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.packlist.PacklistService;
import de.eshg.inspection.util.Holder;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.error.ErrorResponse;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.CurrentUserHelper;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import java.time.Clock;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

@Component
public class InspectionUpdater {

  private static final Logger log = LoggerFactory.getLogger(InspectionUpdater.class);

  private static final DateTimeFormatter DATE_FORMAT =
      DateTimeFormatter.ofPattern("dd.MM.yyyy", Locale.GERMAN);
  private static final int OBJECT_TYPE_STANDARD_BUFFER_DEFAULT = 120;

  private final InspectionRepository inspectionRepository;
  private final ChecklistDefinitionVersionRepository cldVersionRepository;
  private final PacklistService packlistService;
  private final UserClient userClient;
  private final CalendarClient calendarClient;
  private final ResourceApi resourceApi;
  private final InventoryApi inventoryApi;
  private final CalendarApi calendarApi;
  private final CalendarEventApi calendarEventApi;
  private final Clock clock;
  private final AuditLogger auditLogger;
  private final FacilityClient facilityClient;
  private final InspectionProgressEntryService inspectionProgressEntryService;

  public InspectionUpdater(
      InspectionRepository inspectionRepository,
      ChecklistDefinitionVersionRepository cldVersionRepository,
      PacklistService packlistService,
      UserClient userClient,
      CalendarClient calendarClient,
      ResourceApi resourceApi,
      InventoryApi inventoryApi,
      CalendarApi calendarApi,
      CalendarEventApi calendarEventApi,
      Clock clock,
      AuditLogger auditLogger,
      FacilityClient facilityClient,
      InspectionProgressEntryService inspectionProgressEntryService) {
    this.inspectionRepository = inspectionRepository;
    this.cldVersionRepository = cldVersionRepository;
    this.packlistService = packlistService;
    this.userClient = userClient;
    this.calendarClient = calendarClient;
    this.resourceApi = resourceApi;
    this.inventoryApi = inventoryApi;
    this.calendarApi = calendarApi;
    this.calendarEventApi = calendarEventApi;
    this.clock = clock;
    this.auditLogger = auditLogger;
    this.facilityClient = facilityClient;
    this.inspectionProgressEntryService = inspectionProgressEntryService;
  }

  Inspection updateInspection(Inspection inspection, UpdateInspectionRequest request) {
    checkInspectionIsNotClosed(
        inspection,
        "Abgeschlossene Vorgänge können nicht geändert werden.",
        "inspection could not be updated");

    if (inspection.getProcedureStatus() == ProcedureStatus.DRAFT) {
      throw new BadRequestException(
          "Inspection is still in DRAFT and needs to be started in order to update it");
    }

    if (inspection.getPhase() == InspectionPhase.NEW && request.centralFileStateID() == null) {
      inspection.setPhase(InspectionPhase.PLANNING);
      inspection.updateProcedureStatus(ProcedureStatus.IN_PROGRESS, clock, auditLogger);
      setInspectionInProgressIfNeeded(inspection);
    }

    if (request.centralFileStateID() != null) {
      // important: check if centralFileStateID exists! (throws if not found)
      facilityClient.getFacilityFileState(request.centralFileStateID());
      // update "sachstand" of the existing related facility
      // note: an inspection always has _exactly one_ related facility
      inspection.getRelatedFacility().setCentralFileStateId(request.centralFileStateID());
    }
    if (request.challenging() != null) {
      inspection.setChallenging(request.challenging());
    }
    if (request.type() != null) {
      inspection.setType(request.type());
    }
    if (request.checklistDefinitionVersionIds() != null) {
      updateSelectedChecklistDefinitionVersions(
          inspection, request.checklistDefinitionVersionIds());
    }
    if (request.packlistDefinitionRevisionIds() != null) {
      packlistService.updateSelectedPacklistDefinitionRevisions(
          inspection, request.packlistDefinitionRevisionIds());
    }
    if (request.notes() != null) {
      updateNotes(inspection, request.notes());
    }
    if (request.plannedAppointment() != null) {
      updatePlannedAppointment(inspection, request.plannedAppointment());
    }
    if (request.executedAppointment() != null) {
      updateExecutedAppointment(inspection, request.executedAppointment());
    }
    if (request.travelTime() != null) {
      updateTravelTime(inspection, request.travelTime());
    }
    if (request.announcementDto() != null) {
      updateAnnouncement(inspection, request.announcementDto());
    }
    if (request.result() != null) {
      updateResult(inspection, request.result());
    }
    if (request.followupType() != null) {
      updateFollowupType(inspection, request.followupType());
    }
    if (request.followupDate() != null) {
      updateFollowupDate(inspection, request.followupDate());
    }
    if (request.assigneeId() != null) {
      updateAssignee(inspection, request.assigneeId());
    }
    if (request.fileNumberSuffix() != null) {
      updateFileNumberSuffix(inspection, request.fileNumberSuffix());
    }

    advanceToReadyForExecutionIfPossible(inspection);
    updateModified(inspection);
    return inspection;
  }

  private void bookResource(
      InspectionResource resource, UUID resourceId, Instant start, Instant end) {
    ResourceCalendar resourceCalendar = calendarApi.getResourceCalendar(resourceId);
    UUID calendarId = resourceCalendar.calendarId();
    BusinessCaseEventRequest createEventRequest =
        new BusinessCaseEventRequest(List.of(calendarId), new EventTimeData(start, end, false));
    DetailedEvent detailedEvent;
    try {
      detailedEvent = calendarEventApi.addBusinessCaseEvent(createEventRequest);
    } catch (Exception exception) {
      log.error("error booking resource", exception);
      throw new BadRequestException(
          "A resource is already booked for the desired time period. With resourceId: "
              + resourceId
              + ". Please select another time.");
    }
    resource.setCalendarEventId(detailedEvent.id());
  }

  Inspection addResource(Inspection inspection, UpdateInspectionAddResourceRequest request) {
    checkInspectionIsNotClosed(
        inspection,
        "Abgeschlossene Vorgänge können nicht geändert werden.",
        "resource could not be added");

    ResourceDto baseResource;
    try {
      baseResource = resourceApi.getResource(request.resourceId());
    } catch (HttpClientErrorException.NotFound ex) {
      throw new BadRequestException("resource id not found");
    }
    InspectionResource resource =
        new InspectionResource(inspection, baseResource.id(), CurrentUserHelper.getCurrentUserId());
    inspection.getResources().add(resource);
    bookResource(resource, request.resourceId(), request.start(), request.end());
    setInspectionInProgressIfNeeded(resource.getInspection());
    updateModified(inspection);
    return inspection;
  }

  Inspection deleteResource(Inspection inspection, UUID resourceId) {
    checkInspectionIsNotClosed(
        inspection,
        "Abgeschlossene Vorgänge können nicht geändert werden.",
        "resource could not be deleted");

    InspectionResource resource =
        findResource(inspection, resourceId)
            .orElseThrow(() -> new NotFoundException("resource not found"));
    calendarEventApi.deleteBusinessCaseEvent(resource.getCalendarEventId());
    inspection.getResources().remove(resource);
    updateModified(inspection);
    return inspection;
  }

  Inspection modifyInventory(
      Inspection inspection, UpdateInspectionModifyInventoryRequest request) {
    checkInspectionIsNotClosed(
        inspection,
        "Abgeschlossene Vorgänge können nicht geändert werden.",
        "inventory could not be changed");

    Optional<InspectionInventory> inv =
        findInventory(inspection, request.bookingId(), request.inventoryId());
    if (inv.isPresent()) {
      InspectionInventory inventory = inv.get();
      if (request.count() > 0) {
        createInspectionInventory(inspection, request);
      } else {
        inventoryApi.cancelInventoryItemBooking(
            request.inventoryId(), inventory.getBookingId(), inventory.getOwnerKey());
        inspection.getInventories().remove(inventory);
      }
    } else if (request.count() > 0) {
      createInspectionInventory(inspection, request);
    }
    updateModified(inspection);
    inspection.getInventories().sort(Comparator.comparing(InspectionInventory::getCreatedAt));
    setInspectionInProgressIfNeeded(inspection);
    return inspection;
  }

  private void createInspectionInventory(
      Inspection inspection, UpdateInspectionModifyInventoryRequest request) {
    try {
      InventoryItemBookingEntry bookingEntry =
          inventoryApi.bookInventoryItem(
              request.inventoryId(), new BookInventoryItemRequest(request.count()));
      InspectionInventory inventory =
          new InspectionInventory(
              inspection,
              bookingEntry.inventoryId(),
              bookingEntry.amount(),
              CurrentUserHelper.getCurrentUserId());
      inventory.setBookingId(bookingEntry.bookingId());
      inventory.setOwnerKey(bookingEntry.ownerKey());
      inspection.getInventories().add(inventory);
    } catch (HttpClientErrorException.NotFound ex) {
      throw new BadRequestException(ErrorCode.NOT_FOUND, "inventory id not found");
    } catch (HttpClientErrorException.BadRequest ex) {
      ErrorResponse responseBody = ex.getResponseBodyAs(ErrorResponse.class);
      if (responseBody != null && responseBody.errorCode() == ErrorCode.DATA_INTEGRITY_VIOLATION) {
        throw new BadRequestException(
            ErrorCode.DATA_INTEGRITY_VIOLATION, "inventory already booked");
      } else {
        throw ex;
      }
    }
  }

  private void setInspectionInProgressIfNeeded(Inspection inspection) {
    if (inspection.getPhase() == InspectionPhase.NEW) {
      inspection.setPhase(InspectionPhase.PLANNING);
      inspection.updateProcedureStatus(ProcedureStatus.IN_PROGRESS, clock, auditLogger);
    }
  }

  private void updatePlannedAppointment(
      Inspection inspection, UpdateInspectionAppointmentDto appointmentDto) {
    // Create or update calendar entry first (if that fails, abort and don't do the rest).
    // But update calendar entry only if the executionAppointment doesn't exist!
    // if the executionAppointment is already set, then we are in the READY_FOR_EXECUTION
    // or EXECUTING phase. In this case the calendar event gets updated by
    // updateExecutedAppointment().
    Optional<InspectionTask> planningTaskOpt = inspection.getPlanningTask();
    if (inspection.getExecutionAppointment() == null) {
      inspection.setCalendarEventId(
          createOrUpdateCalendarEvent(
              appointmentDto, inspection.getCalendarEventId(), planningTaskOpt.orElse(null)));
    }

    // create or update plannedAppointment
    InspectionAppointment plannedAppointment = inspection.getPlannedAppointment();
    if (plannedAppointment == null) {
      plannedAppointment = new InspectionAppointment();
      inspection.setPlannedAppointment(plannedAppointment);
    }

    // set start and end date of plannedAppointment
    Instant appointmentStart = appointmentDto.start();
    Instant appointmentEnd = appointmentDto.end();
    plannedAppointment.setAppointmentStart(appointmentStart);
    plannedAppointment.setAppointmentEnd(appointmentEnd);

    // get or create planning task
    InspectionTask planningTask =
        planningTaskOpt.orElseGet(
            () ->
                inspection.createPlanningTask(
                    CurrentUserHelper.getCurrentUserId(), clock.instant()));
    planningTask.updateDueAt(computePlanningDueDate(inspection, appointmentStart));
  }

  private void updateExecutedAppointment(
      Inspection inspection, UpdateInspectionAppointmentDto appointmentDto) {
    // create or update calendar entry first (if that fails, abort and don't do the rest)
    InspectionTask task =
        inspection.getExecutionTask().orElseGet(() -> inspection.getPlanningTask().orElse(null));
    inspection.setCalendarEventId(
        createOrUpdateCalendarEvent(appointmentDto, inspection.getCalendarEventId(), task));

    // create or update executionAppointment
    InspectionAppointment executionAppointment = inspection.getExecutionAppointment();
    if (executionAppointment == null) {
      executionAppointment = new InspectionAppointment();
      inspection.setExecutionAppointment(executionAppointment);
    }

    // set start and end date of executionAppointment
    Instant appointmentStart = appointmentDto.start();
    Instant appointmentEnd = appointmentDto.end();
    executionAppointment.setAppointmentStart(appointmentStart);
    executionAppointment.setAppointmentEnd(appointmentEnd);

    advanceToExecutingPhase(inspection);
  }

  private void updateTravelTime(
      Inspection inspection, UpdateInspectionTravelTimeDto travelTimeDto) {

    InspectionTravelTime travelTime = inspection.getTravelTime();
    if (travelTime == null) {
      travelTime = new InspectionTravelTime();
      inspection.setTravelTime(travelTime);
    }

    travelTime.setStartBufferInMinutes(travelTimeDto.startBufferInMinutes());
    travelTime.setStartTime(travelTimeDto.startTime());
    travelTime.setEndBufferInMinutes(travelTimeDto.endBufferInMinutes());
    travelTime.setEndTime(travelTimeDto.endTime());
  }

  private void updateAnnouncement(
      Inspection inspection, InspectionAnnouncementDto announcementDto) {
    InspectionAnnouncement inspectionAnnouncement = new InspectionAnnouncement();
    Instant announcementDate = announcementDto.date();
    InspectionAnnouncementType announcementType = announcementDto.type();
    inspectionAnnouncement.setDate(announcementDate);
    inspectionAnnouncement.setType(announcementType);
    inspection.setAnnouncement(inspectionAnnouncement);
    inspectionProgressEntryService.addAnnouncementProgressEntry(
        announcementType, announcementDate.atZone(clock.getZone()).format(DATE_FORMAT), inspection);
  }

  private UUID createOrUpdateCalendarEvent(
      @NotNull UpdateInspectionAppointmentDto data,
      @Nullable UUID existingCalendarEventId,
      InspectionTask task) {
    UUID assigneeId = task != null ? task.getAssigneeId() : null;
    if (existingCalendarEventId != null) {
      return calendarClient.updateEventInUserCalendar(
          existingCalendarEventId, data.start(), data.end(), assigneeId);
    } else {
      return calendarClient.createEventInUserCalendar(data.start(), data.end(), assigneeId);
    }
  }

  /**
   * Computes the due date for the planning task of an inspection; it's the planned start date minus
   * the standard buffer time of the object type of the inspection's facility.
   */
  private static Instant computePlanningDueDate(
      Inspection inspection, Instant plannedExecutionStart) {
    ObjectType objectType = inspection.getFacility().getObjectType();
    int standardBufferTime =
        ofNullable(objectType.getStandardBufferTime()).orElse(OBJECT_TYPE_STANDARD_BUFFER_DEFAULT);
    return plannedExecutionStart.minus(standardBufferTime, ChronoUnit.MINUTES);
  }

  private void updateSelectedChecklistDefinitionVersions(
      Inspection inspection, List<UUID> selectedChecklistDefinitionVersionIds) {
    Map<UUID, ChecklistDefinitionVersion> selectedVersionsMap =
        cldVersionRepository.findAllById(selectedChecklistDefinitionVersionIds).stream()
            .collect(StreamUtil.toLinkedHashMap(ChecklistDefinitionVersion::getId));

    // first, some basic user input validation
    List<String> missingIds =
        selectedChecklistDefinitionVersionIds.stream()
            .filter(id -> !selectedVersionsMap.containsKey(id))
            .map(UUID::toString)
            .toList();
    if (!missingIds.isEmpty()) {
      throw new BadRequestException(
          "The following checklistDefinitionVersionIds were not found: "
              + String.join(",", missingIds));
    }
    Set<UUID> cldvDefinitionSet = new HashSet<>();
    selectedVersionsMap
        .values()
        .forEach(
            cldv -> {
              if (cldv.getChecklistDefinition().isDeleted()) {
                throw new BadRequestException(
                    "Checklists that are marked as deleted can not be added");
              }

              if (!cldv.getChecklistDefinition()
                  .getObjectTypes()
                  .getLast()
                  .getId()
                  .equals(inspection.getFacility().getObjectType().getId())) {
                throw new BadRequestException(
                    "Checklists are required to have the same object type as the inspection facility");
              }

              if (cldv.getChecklistDefinition().isCoreChecklist()) {
                throw new BadRequestException(
                    "Adding core checklists via user input is not allowed");
              }

              boolean uniquelyAdded = cldvDefinitionSet.add(cldv.getChecklistDefinition().getId());
              if (!uniquelyAdded) {
                throw new BadRequestException(
                    ErrorCode.CONFLICT,
                    "Only a single version per checklist definition is allowed");
              }
            });

    if (inspection.getPhase() == InspectionPhase.NEW
        || inspection.getPhase() == InspectionPhase.PLANNING
        || inspection.getPhase() == InspectionPhase.READY_FOR_EXECUTION) {
      updateSelectedChecklistDefinitionVersionsInPlanningPhases(selectedVersionsMap, inspection);
    } else {
      updateChecklistsInExecutionPhase(selectedVersionsMap, inspection);
    }

    // ISSUE-3528: always sort checklists by name for now, to retain a stable order in tests
    // Later on, we will add functionality to reorder the checklists by the user.
    renumberChecklistPositions(inspection);
  }

  private void updateSelectedChecklistDefinitionVersionsInPlanningPhases(
      Map<UUID, ChecklistDefinitionVersion> selectedVersionsMap, Inspection inspection) {
    // in planning phase we also add core checklists before user input checklists
    List<ChecklistDefinitionVersion> coreCldvs =
        cldVersionRepository
            .findNewestCoreCLDVersionsForObjectType(inspection.getFacility().getObjectType())
            .stream()
            .toList();
    if (selectedVersionsMap.isEmpty() && coreCldvs.isEmpty()) {
      throw new BadRequestException(
          ErrorCode.BAD_REQUEST, "An inspection has to have at least one checklist");
    }
    List<Checklist> newChecklists = new ArrayList<>();

    Holder<Boolean> isExpandable = new Holder<>(true);
    coreCldvs.forEach(
        coreCldv -> {
          if (!coreCldv.isExpandable()) {
            if (!selectedVersionsMap.isEmpty()) {
              throw new BadRequestException(
                  ErrorCode.CONFLICT,
                  "A non-expandable core checklist exists for this object type that disallows adding custom checklists");
              // There is always a short time frame between choosing (reading) checklists and
              // actually adding them (this function right here).
              // In the case where no non-expandable checklist exists:
              // During the mentioned timeframe, a new non-expandable checklist could be created,
              // so bad request is thrown right here. Even though it's not an error by the user.
              // In this case, if the user still wants to update the selected checklists, the
              // checklist selecting-process has to be redone by the user.
              // As this should be a very rare occurrence, this should be fine for the user.
              // This is the preferable solution instead of overwriting the user's choice, because
              // it gives the user the freedom to act on it.
            }
            isExpandable.set(false);
          }

          Checklist existingCl =
              inspection.getChecklists().stream()
                  .filter(cl -> cl.getChecklistDefinitionVersion().getId().equals(coreCldv.getId()))
                  .findFirst()
                  .orElse(null);

          if (existingCl != null) {
            existingCl.setPosition(newChecklists.size());
            newChecklists.add(existingCl);
          } else {
            newChecklists.add(ChecklistService.createChecklist(coreCldv, inspection));
          }
        });

    // add user input checklists
    if (Boolean.TRUE.equals(isExpandable.get())) {
      selectedVersionsMap.forEach(
          (id, version) -> {
            Checklist existingCl =
                inspection.getChecklists().stream()
                    .filter(
                        cl -> cl.getChecklistDefinitionVersion().getId().equals(version.getId()))
                    .findFirst()
                    .orElse(null);
            if (existingCl != null) {
              existingCl.setPosition(newChecklists.size());
              newChecklists.add(existingCl);
            } else {
              addVersionToNewChecklists(version, inspection, newChecklists);
            }
          });
    }

    // write checklists
    inspection.getChecklists().clear();
    inspection.getChecklists().addAll(newChecklists);
  }

  private void updateChecklistsInExecutionPhase(
      Map<UUID, ChecklistDefinitionVersion> selectedVersionsMap, Inspection inspection) {
    if (inspection.getChecklists().stream()
            .map(Checklist::getChecklistDefinitionVersion)
            .anyMatch(cldv -> !cldv.isExpandable())
        && !selectedVersionsMap.isEmpty()) {
      throw new BadRequestException(
          ErrorCode.CONFLICT,
          "This inspection has a non-expandable core checklist that disallows adding custom checklists");
    }

    List<UUID> checkListsIdsToRemove =
        inspection.getChecklists().stream()
            .filter(
                cl -> {
                  boolean clIsStillSelected =
                      selectedVersionsMap.containsKey(cl.getChecklistDefinitionVersion().getId());
                  boolean clIsCoreChecklist =
                      cl.getChecklistDefinitionVersion().getChecklistDefinition().isCoreChecklist();
                  return !(clIsStillSelected || clIsCoreChecklist);
                })
            .map(GloballyUniqueEntityBase::getId)
            .toList();

    List<Long> incidentIdsToDelete =
        inspection.getIncidents().stream()
            .filter(
                inspectionIncident ->
                    Optional.ofNullable(inspectionIncident.getChecklistElement())
                        .map(ChecklistElement::getChecklistSection)
                        .map(ChecklistSection::getChecklist)
                        .map(GloballyUniqueEntityBase::getId)
                        .map(checkListsIdsToRemove::contains)
                        .orElse(false))
            .map(BaseEntity::getId)
            .toList();

    inspection
        .getIncidents()
        .removeIf(inspectionIncident -> incidentIdsToDelete.contains(inspectionIncident.getId()));

    // remove checklists that are now unselected
    inspection
        .getChecklists()
        .removeIf(checklist -> checkListsIdsToRemove.contains(checklist.getId()));

    // find new selected checklists and add them to newChecklists
    selectedVersionsMap.forEach(
        (id, version) -> {
          boolean versionIdNotYetInNewChecklists =
              inspection.getChecklists().stream()
                  .noneMatch(cl -> cl.getChecklistDefinitionVersion().getId().equals(id));
          if (versionIdNotYetInNewChecklists) {
            addVersionToNewChecklists(version, inspection, inspection.getChecklists());
          }
        });

    if (inspection.getChecklists().isEmpty()) {
      throw new BadRequestException(
          ErrorCode.BAD_REQUEST, "An inspection has to have at least one checklist");
    }
  }

  private static void renumberChecklistPositions(Inspection inspection) {
    AtomicInteger count = new AtomicInteger(0);
    inspection.getChecklists().stream()
        .sorted(Comparator.comparing(cl -> cl.getChecklistDefinitionVersion().getName()))
        .forEach(cl -> cl.setPosition(count.getAndIncrement()));
  }

  private void addVersionToNewChecklists(
      ChecklistDefinitionVersion version, Inspection inspection, List<Checklist> newChecklists) {
    if (version.getValidTo() != null) {
      throw new BadRequestException(
          "not allowed to set old checklistDefinitionVersion; select the newest version");
    }
    Checklist checklist = ChecklistService.createChecklist(version, inspection);
    checklist.setPosition(newChecklists.size());
    newChecklists.add(checklist);
  }

  private void updateNotes(Inspection inspection, String notes) {
    inspection.setNotes(notes);
  }

  private void updateResult(Inspection inspection, InspectionResult result) {
    inspection.setResult(result);
    if (result != InspectionResult.SUCCESSFUL_WITH_INCIDENTS) {
      inspection.setFollowupType(null);
      inspection.setFollowupDate(null);
    }
  }

  private void updateFollowupType(Inspection inspection, FollowupType followupType) {
    if (inspection.getResult() != InspectionResult.SUCCESSFUL_WITH_INCIDENTS) {
      throw new BadRequestException("can't set followupType; result is " + inspection.getResult());
    }
    inspection.setFollowupType(followupType);
    if (followupType != FollowupType.REVIEW && followupType != FollowupType.DOCUMENT_INSPECTION) {
      inspection.setFollowupDate(null);
    }
  }

  private void updateFollowupDate(Inspection inspection, Instant followupDate) {
    FollowupType followupType = inspection.getFollowupType();
    if (inspection.getResult() != InspectionResult.SUCCESSFUL_WITH_INCIDENTS
        || followupType != FollowupType.REVIEW) {
      throw new BadRequestException(
          "can't set followupDate; result is %s and followupType is %s"
              .formatted(inspection.getResult(), followupType));
    }
    inspection.setFollowupDate(followupDate);
  }

  private void updateAssignee(Inspection inspection, UUID assigneeId) {
    UUID currentUserId = CurrentUserHelper.getCurrentUserId();
    if (!currentUserId.equals(assigneeId)
        && userClient.getUserById(assigneeId).username().equals(UNKNOWN_USER)) {
      throw new BadRequestException("%s not allowed for assignment".formatted(UNKNOWN_USER));
    }
    for (InspectionTask task : inspection.getTasks()) {
      task.assign(assigneeId, currentUserId, Instant.now(clock));
    }

    // Create planning task if it doesn't exist yet.
    if (inspection.getPlanningTask().isEmpty()) {
      inspection.createPlanningTask(assigneeId, clock.instant());
    }

    if (inspection.getCalendarEventId() != null) {
      inspection.setCalendarEventId(
          calendarClient.updateEventInUserCalendar(inspection.getCalendarEventId(), assigneeId));
    }
  }

  private void updateFileNumberSuffix(Inspection inspection, Integer fileNumberSuffix) {
    inspection.setFileNumberSuffix(fileNumberSuffix == 0 ? null : fileNumberSuffix);
  }

  Inspection lockInspection(Inspection inspection, boolean lock) {
    if (lock) {
      if (inspection.getLockedBy() == null) {
        inspection.setLockedBy(CurrentUserHelper.getCurrentUserId());
        inspection.setLockedAt(Instant.now(clock));
      } else if (inspection.getLockedBy().equals(CurrentUserHelper.getCurrentUserId())) {
        // User tried to lock the inspection which is already locked by him.
        // That's ok and it is a no-op. We don't even update the modified timestamp.
        return inspection;
      } else {
        throw new BadRequestException(ErrorCode.LOCKED, "The inspection is already locked.");
      }
    } else {
      if (inspection.getLockedBy() != null) {
        if (inspection.getLockedBy().equals(CurrentUserHelper.getCurrentUserId())
            || CurrentUserHelper.currentUserHasRole(INSPECTION_LEADER)) {
          inspection.setLockedBy(null);
          inspection.setLockedAt(null);
        } else {
          throw new BadRequestException(
              ErrorCode.LOCKED, "User is not allowed to unlock inspection.");
        }
      } else {
        // User tried to unlock an inspection which is not locked.
        // That's ok and it is a no-op. We don't even update the modified timestamp.
        return inspection;
      }
    }
    updateModified(inspection);
    return inspection;
  }

  public void updateModified(Inspection inspection) {
    inspection.setModifiedBy(CurrentUserHelper.getCurrentUserId());
    // we must flush here so that the `createdAt/lastModifiedAt` timestamps are set immediately and
    // make it into the DTO
    inspectionRepository.flush();
  }

  private static Optional<InspectionResource> findResource(
      Inspection inspection, @NotNull UUID resourceId) {
    return inspection.getResources().stream()
        .filter(i -> i.getBaseResourceId().equals(resourceId))
        .findAny();
  }

  private static Optional<InspectionInventory> findInventory(
      Inspection inspection, Long bookingId, @NotNull UUID inventoryId) {
    if (bookingId != null) {
      return inspection.getInventories().stream()
          .filter(i -> i.getBaseInventoryId().equals(inventoryId) && i.getBookingId() == bookingId)
          .findAny();
    } else {
      return inspection.getInventories().stream()
          .filter(i -> i.getBaseInventoryId().equals(inventoryId))
          .findAny();
    }
  }

  private void advanceToReadyForExecutionIfPossible(Inspection inspection) {
    if (inspection.getPhase().equals(InspectionPhase.PLANNING)
        && inspection.getPlannedAppointment() != null
        && !inspection.getChecklists().isEmpty()
        && (!inspection.getFacility().getObjectType().isEmailAnnouncement()
            || (inspection.getFacility().getObjectType().isEmailAnnouncement()
                && inspection.getAnnouncement() != null))) {
      // All requirements fulfilled to advance to phase READY_FOR_EXECUTION.
      // But first check that we don't do this twice:
      if (inspection.getExecutionAppointment() != null) {
        throw new IllegalStateException("executionAppointment already set");
      }
      // copy plannedAppointment to executionAppointment
      inspection.setExecutionAppointment(inspection.getPlannedAppointment().getClone());
      // create execution task
      InspectionTask executionTask = inspection.createExecutionTask(clock.instant());
      executionTask.updateDueAt(inspection.getExecutionAppointment().getAppointmentStart());
      // set next phase
      inspection.setPhase(InspectionPhase.READY_FOR_EXECUTION);
    }
  }

  public void advanceToExecutingPhase(Inspection inspection) {
    if (inspection.getPhase() == InspectionPhase.READY_FOR_EXECUTION) {
      inspection.setPhase(InspectionPhase.EXECUTING);
      InspectionTask planningTask =
          inspection
              .getPlanningTask()
              .orElseGet(
                  () ->
                      inspection.createPlanningTask(
                          CurrentUserHelper.getCurrentUserId(), clock.instant()));
      planningTask.setTaskStatus(TaskStatus.CLOSED);
      InspectionAppointment plannedAppointment = inspection.getPlannedAppointment();
      if (plannedAppointment != null) {
        planningTask.updateDueAt(
            computePlanningDueDate(inspection, plannedAppointment.getAppointmentStart()));
      }
    }
  }
}
