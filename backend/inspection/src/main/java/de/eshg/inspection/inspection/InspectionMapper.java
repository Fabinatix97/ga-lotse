/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection;

import static java.util.Optional.ofNullable;

import de.eshg.base.calendar.CalendarEventApi;
import de.eshg.base.calendar.api.GetBusinessCaseEventResponse;
import de.eshg.base.centralfile.api.facility.GetFacilityFileStateResponse;
import de.eshg.base.inventory.InventoryApi;
import de.eshg.base.resource.ResourceApi;
import de.eshg.base.resource.api.ResourceDto;
import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.checklist.ChecklistService;
import de.eshg.inspection.checklist.persistence.Checklist;
import de.eshg.inspection.checklistdefinition.persistence.ChecklistDefinitionVersion;
import de.eshg.inspection.client.UserClient;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.facility.FacilityMapper;
import de.eshg.inspection.facility.api.InspFacilityDto;
import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.incident.InspectionIncidentMapper;
import de.eshg.inspection.incident.api.InspectionIncidentDto;
import de.eshg.inspection.incident.persistence.InspectionIncident;
import de.eshg.inspection.inspection.api.InspectionAnnouncementDto;
import de.eshg.inspection.inspection.api.InspectionAppointmentDto;
import de.eshg.inspection.inspection.api.InspectionAvailableCLDVersionsResponse;
import de.eshg.inspection.inspection.api.InspectionAvailablePLDRevisionsResponse;
import de.eshg.inspection.inspection.api.InspectionCLDVersionDto;
import de.eshg.inspection.inspection.api.InspectionDto;
import de.eshg.inspection.inspection.api.InspectionDto.ReportInfoDto;
import de.eshg.inspection.inspection.api.InspectionFollowupInfoDto;
import de.eshg.inspection.inspection.api.InspectionForDuplicateReviewDto;
import de.eshg.inspection.inspection.api.InspectionInventoryDto;
import de.eshg.inspection.inspection.api.InspectionPLDRevisionDto;
import de.eshg.inspection.inspection.api.InspectionResourceDto;
import de.eshg.inspection.inspection.api.InspectionTravelTimeDto;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionAnnouncement;
import de.eshg.inspection.inspection.persistence.InspectionAppointment;
import de.eshg.inspection.inspection.persistence.InspectionTask;
import de.eshg.inspection.inspection.persistence.InspectionTravelTime;
import de.eshg.inspection.packlist.persistence.Packlist;
import de.eshg.inspection.packlistdefinition.persistence.PacklistDefinitionRevision;
import de.eshg.inspection.report.persistence.Report;
import de.eshg.inspection.util.Holder;
import de.eshg.lib.procedure.domain.model.Pdf;
import de.eshg.lib.procedure.domain.model.Task;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.procedure.mapping.ProcedureMapper;
import de.eshg.rest.service.error.BadRequestException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class InspectionMapper {

  private static final Logger log = LoggerFactory.getLogger(InspectionMapper.class);

  private final InventoryApi inventoryApi;
  private final ResourceApi resourceApi;
  private final UserClient userClient;
  private final CalendarEventApi calendarEventApi;
  private final FacilityClient facilityClient;

  public InspectionMapper(
      InventoryApi inventoryApi,
      ResourceApi resourceApi,
      UserClient userClient,
      CalendarEventApi calendarEventApi,
      FacilityClient facilityClient) {
    this.inventoryApi = inventoryApi;
    this.resourceApi = resourceApi;
    this.userClient = userClient;
    this.calendarEventApi = calendarEventApi;
    this.facilityClient = facilityClient;
  }

  public static String mapToTaskSummary(String facilityName, TaskType taskType) {
    return switch (taskType) {
      case TaskType.INSPECTION_PLANNING ->
          "Begehung der Einrichtung %s planen".formatted(facilityName);
      case TaskType.INSPECTION_EXECUTION ->
          "Begehung der Einrichtung %s ausführen".formatted(facilityName);
      case TaskType.INSPECTION_REPORT ->
          "Begehung der Einrichtung %s fertigstellen".formatted(facilityName);
      default -> "Begehung der Einrichtung %s".formatted(facilityName);
    };
  }

  public static String mapToInspectionTitle(String facilityName) {
    return "Begehung für %s".formatted(facilityName);
  }

  public String getInspectionTaskSummary(InspectionTask task) {
    GetFacilityFileStateResponse baseFacility =
        facilityClient.getFacilityFileState(
            task.getProcedure().getRelatedFacility().getCentralFileStateId());
    return mapToTaskSummary(baseFacility.name(), task.getTaskType());
  }

  public String getInspectionTitle(Inspection inspection) {
    InspFacilityDto facilityDto =
        mapToDto(inspection.getCentralFileStateId(), inspection.getFacility());
    return mapToInspectionTitle(facilityDto.baseFacility().name());
  }

  public InspectionDto mapToDto(Inspection inspection) {
    InspFacilityDto facilityDto =
        mapToDto(inspection.getCentralFileStateId(), inspection.getFacility());
    return mapToDto(inspection, facilityDto);
  }

  InspectionDto mapToDto(Inspection inspection, InspFacilityDto facility) {
    List<InspectionCLDVersionDto> selectedCLDVersions;
    try {
      selectedCLDVersions = mapChecklistsToInspectionCLDVersionDto(inspection.getChecklists());
    } catch (BadRequestException exception) {
      log.error(
          "Failed to load checklists for inspection with ID {}",
          inspection.getExternalId(),
          exception);
      selectedCLDVersions = Collections.emptyList();
    }

    List<InspectionPLDRevisionDto> selectedPLDRevisions;
    try {
      selectedPLDRevisions = mapPacklistsToInspectionPLDRevisionDto(inspection.getPacklists());
    } catch (BadRequestException exception) {
      log.error(
          "Failed to load packlists for inspection with ID {}",
          inspection.getExternalId(),
          exception);
      selectedPLDRevisions = Collections.emptyList();
    }

    UUID assigneeId = inspection.getPlanningTask().map(Task::getAssigneeId).orElse(null);
    UserDto assignee = null;
    if (assigneeId != null) {
      assignee = userClient.getUserById(assigneeId);
    }

    UserDto lockedByUser = null;
    UUID lockedByUserId = inspection.getLockedBy();
    if (lockedByUserId != null) {
      lockedByUser =
          lockedByUserId.equals(assigneeId) ? assignee : userClient.getUserById(lockedByUserId);
    }

    return new InspectionDto(
        inspection.getExternalId(),
        mapToInspectionTitle(facility.baseFacility().name()),
        ProcedureMapper.toInterfaceType(inspection.getProcedureStatus()),
        inspection.isChallenging(),
        facility,
        inspection.getType(),
        inspection.getPhase(),
        inspection.getResult(),
        selectedCLDVersions,
        selectedPLDRevisions,
        inspection.getNotes(),
        mapInventories(inspection),
        mapResources(inspection),
        mapAppointment(inspection.getPlannedAppointment(), inspection.getPlanningTask()),
        mapAppointment(inspection.getExecutionAppointment(), inspection.getExecutionTask()),
        mapTravelTime(inspection.getTravelTime()),
        mapToDto(inspection.getAnnouncement()),
        ofNullable(inspection.getReport()).map(Report::getExternalId).orElse(null),
        ofNullable(inspection.getReport()).map(this::mapReportInfo).orElse(null),
        mapFollowupInfoToDto(inspection),
        mapIncidents(inspection),
        assignee,
        lockedByUser,
        inspection.getFacility().hasPossibleDuplicates(),
        !inspection.getPossibleDuplicates().isEmpty());
  }

  private List<InspectionInventoryDto> mapInventories(Inspection inspection) {
    return inspection.getInventories().stream()
        .map(
            i ->
                new InspectionInventoryDto(
                    i.getBaseInventoryId(),
                    // maybe add a bulk operation for this later
                    inventoryApi.getInventoryItem(i.getBaseInventoryId()).name(),
                    inventoryApi.getInventoryItem(i.getBaseInventoryId()).type(),
                    i.getCount(),
                    i.getBookingId()))
        .toList();
  }

  private List<InspectionResourceDto> mapResources(Inspection inspection) {
    return inspection.getResources().stream()
        .map(
            r -> {
              // maybe add a bulk operation for this later
              ResourceDto baseRes = resourceApi.getResource(r.getBaseResourceId());

              GetBusinessCaseEventResponse baseCalendarEvent =
                  calendarEventApi.getBusinessCaseEvent(r.getCalendarEventId());
              Instant start = baseCalendarEvent.event().timeData().start();
              Instant end = baseCalendarEvent.event().timeData().end();

              return new InspectionResourceDto(
                  r.getBaseResourceId(), baseRes.name(), baseRes.type(), start, end);
            })
        .toList();
  }

  private ReportInfoDto mapReportInfo(Report report) {
    Pdf reportFile = report.getReportFile();
    if (reportFile == null) return null;
    Instant reportDate = report.getReportFile().getMetaData().getCreatedDate();
    return new ReportInfoDto(
        report.getId(),
        reportDate,
        reportFile.getCreatedBy(),
        reportFile.getFileName(),
        reportFile.getFileSizeBytes(),
        reportFile.getExternalId());
  }

  public static List<InspectionIncidentDto> mapIncidents(Inspection inspection) {
    return getSortedIncidents(inspection.getIncidents())
        .map(InspectionIncidentMapper::mapToDto)
        .toList();
  }

  public static Stream<InspectionIncident> getSortedIncidents(List<InspectionIncident> incidents) {
    return incidents.stream()
        .sorted(
            Comparator.comparing(
                    InspectionIncident::getChecklistNumber,
                    Comparator.nullsLast(Integer::compareTo))
                .thenComparing(
                    InspectionIncident::getSectionNumber, Comparator.nullsLast(Integer::compareTo))
                .thenComparing(
                    InspectionIncident::getElementNumber, Comparator.nullsLast(Integer::compareTo))
                .thenComparing(
                    InspectionIncident::getManualPosition,
                    Comparator.nullsLast(Integer::compareTo)));
  }

  private InspectionAppointmentDto mapAppointment(
      InspectionAppointment appointment, Optional<InspectionTask> task) {
    if (appointment == null) return null;
    return new InspectionAppointmentDto(
        appointment.getAppointmentStart(),
        appointment.getAppointmentEnd(),
        task.map(Task::getAssigneeId).map(userClient::getUserById).orElse(null));
  }

  private InspectionTravelTimeDto mapTravelTime(InspectionTravelTime travelTime) {
    if (travelTime == null) return null;
    return new InspectionTravelTimeDto(
        travelTime.getStartBufferInMinutes(),
        travelTime.getStartTime(),
        travelTime.getEndBufferInMinutes(),
        travelTime.getEndTime());
  }

  private InspectionFollowupInfoDto mapFollowupInfoToDto(Inspection inspection) {
    // followupType may be null when user has approved the Inspection with InspectionResult
    // SUCCESSFUL.
    // In that case, followupInspection is not null!
    // But followupInspection is created after approving, so it's null before that.
    // So followupType may exist for other InspectionResults before approval and this has to be
    // rendered for the user.
    if (inspection.getFollowupInspection() == null && inspection.getFollowupType() == null) {
      return null;
    }
    Inspection followupInspection = inspection.getFollowupInspection();
    return new InspectionFollowupInfoDto(
        inspection.getFollowupType(),
        inspection.getFollowupDate(),
        followupInspection != null ? followupInspection.getExternalId() : null);
  }

  public void addChecklistVersionToInspection(
      ChecklistDefinitionVersion version, Inspection inspection) {
    inspection.getChecklists().add(ChecklistService.createChecklist(version, inspection));
  }

  List<InspectionCLDVersionDto> mapChecklistsToInspectionCLDVersionDto(List<Checklist> checklists) {
    return checklists.stream()
        .map(Checklist::getChecklistDefinitionVersion)
        .map(InspectionMapper::mapToDto)
        .toList();
  }

  InspectionAvailableCLDVersionsResponse mapCldvsToResponse(
      List<ChecklistDefinitionVersion> versions, boolean includeIfNotExpandable) {
    List<InspectionCLDVersionDto> nonCoreVersions = new ArrayList<>();
    List<InspectionCLDVersionDto> coreVersions = new ArrayList<>();

    Holder<Boolean> isExpandable = new Holder<>(true);
    versions.forEach(
        version -> {
          InspectionCLDVersionDto dtoVersion = InspectionMapper.mapToDto(version);
          if (dtoVersion.isCoreChecklist()) {
            if (!version.isExpandable()) {
              isExpandable.set(false);
            }
            coreVersions.add(dtoVersion);
          } else {
            nonCoreVersions.add(dtoVersion);
          }
        });

    // not expandable cl found?
    if (Boolean.FALSE.equals(isExpandable.get()) && !includeIfNotExpandable) {
      nonCoreVersions.clear();
      return new InspectionAvailableCLDVersionsResponse(nonCoreVersions, coreVersions, false);
    } else {
      return new InspectionAvailableCLDVersionsResponse(nonCoreVersions, coreVersions, true);
    }
  }

  private static InspectionCLDVersionDto mapToDto(ChecklistDefinitionVersion v) {
    return new InspectionCLDVersionDto(
        v.getId(),
        v.getChecklistDefinition().getId(),
        v.getName(),
        v.getDescription(),
        v.getVersion(),
        v.getChecklistDefinition().isCoreChecklist(),
        v.isExpandable());
  }

  List<InspectionPLDRevisionDto> mapPacklistsToInspectionPLDRevisionDto(List<Packlist> packlists) {
    return packlists.stream()
        .map(Packlist::getPacklistDefinitionRevision)
        .map(InspectionMapper::mapToDto)
        .toList();
  }

  InspectionAvailablePLDRevisionsResponse mapPldrsToResponse(
      List<PacklistDefinitionRevision> revisions) {
    return new InspectionAvailablePLDRevisionsResponse(
        revisions.stream().map(InspectionMapper::mapToDto).toList());
  }

  private static InspectionPLDRevisionDto mapToDto(PacklistDefinitionRevision r) {
    return new InspectionPLDRevisionDto(
        r.getId(),
        r.getPacklistDefinition().getId(),
        r.getName(),
        r.getDescription(),
        r.getRevision());
  }

  InspFacilityDto mapToDto(UUID centralFileStateId, Facility facility) {
    GetFacilityFileStateResponse baseFacility =
        facilityClient.getFacilityFileState(centralFileStateId);
    return FacilityMapper.fromGetFacilityResponse(facility, baseFacility);
  }

  public static InspectionAnnouncementDto mapToDto(InspectionAnnouncement inspectionAnnouncement) {
    if (inspectionAnnouncement == null) {
      return null;
    }
    return new InspectionAnnouncementDto(
        inspectionAnnouncement.getDate(), inspectionAnnouncement.getType());
  }

  public static InspectionForDuplicateReviewDto mapToDtoForDuplicateReview(
      Inspection inspection, String title) {

    Instant executedTime =
        Optional.ofNullable(inspection.getExecutionAppointment())
            .map(InspectionAppointment::getAppointmentStart)
            .orElse(
                Optional.ofNullable(inspection.getPlannedAppointment())
                    .map(InspectionAppointment::getAppointmentStart)
                    .orElse( // This case should never happen but just in case we handle it without
                        // throwing an exception
                        Instant.ofEpochSecond(0)));

    return new InspectionForDuplicateReviewDto(
        inspection.getExternalId(),
        title,
        inspection.getType(),
        inspection.getResult(),
        executedTime,
        inspection.getIncidents().size());
  }
}
