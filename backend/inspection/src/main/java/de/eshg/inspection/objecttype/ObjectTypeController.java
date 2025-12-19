/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype;

import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.facility.persistence.FacilityRepository;
import de.eshg.inspection.feature.InspectionFeature;
import de.eshg.inspection.feature.InspectionFeatureToggle;
import de.eshg.inspection.inspection.InspectionFinalizer;
import de.eshg.inspection.inspection.InspectionService;
import de.eshg.inspection.inspection.api.InspectionResult;
import de.eshg.inspection.inspection.api.InspectionType;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionAppointment;
import de.eshg.inspection.inspection.persistence.InspectionRepository;
import de.eshg.inspection.objecttype.api.GetObjectTypesHierarchyResponse;
import de.eshg.inspection.objecttype.api.GetObjectTypesResponse;
import de.eshg.inspection.objecttype.api.ObjectTypeDto;
import de.eshg.inspection.objecttype.api.SingleObjectTypeResponse;
import de.eshg.inspection.objecttype.api.UpdateObjectTypeRequest;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.objecttype.persistence.ObjectTypeHierarchyTreeNodeRepository;
import de.eshg.inspection.objecttype.persistence.ObjectTypeRepository;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = ObjectTypeController.BASE_URL, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "ObjectType")
public class ObjectTypeController {

  public static final String BASE_URL = BaseUrls.Inspection.OBJECT_TYPE_CONTROLLER;

  private static final Logger log = LoggerFactory.getLogger(ObjectTypeController.class);

  private final ObjectTypeRepository objectTypeRepository;
  private final ObjectTypeHierarchyTreeNodeRepository objectTypeHierarchyTreeNodeRepository;
  private final InspectionService inspectionService;
  private final FacilityRepository facilityRepository;
  private final InspectionFeatureToggle inspectionFeatureToggle;
  private final InspectionRepository inspectionRepository;
  private final InspectionFinalizer inspectionFinalizer;
  private final Clock clock;

  public ObjectTypeController(
      ObjectTypeRepository objectTypeRepository,
      ObjectTypeHierarchyTreeNodeRepository objectTypeHierarchyTreeNodeRepository,
      InspectionService inspectionService,
      FacilityRepository facilityRepository,
      InspectionFeatureToggle inspectionFeatureToggle,
      InspectionRepository inspectionRepository,
      InspectionFinalizer inspectionFinalizer,
      Clock clock) {
    this.objectTypeRepository = objectTypeRepository;
    this.objectTypeHierarchyTreeNodeRepository = objectTypeHierarchyTreeNodeRepository;
    this.inspectionService = inspectionService;
    this.facilityRepository = facilityRepository;
    this.inspectionFeatureToggle = inspectionFeatureToggle;
    this.inspectionRepository = inspectionRepository;
    this.inspectionFinalizer = inspectionFinalizer;
    this.clock = clock;
  }

  @GetMapping
  @Operation(summary = "Get all objecttypes")
  @Transactional(readOnly = true)
  public GetObjectTypesResponse getObjectTypes() {
    return new GetObjectTypesResponse(
        objectTypeRepository.findAll().stream()
            .map(ObjectTypeMapper::toDto)
            .sorted(Comparator.comparing(ObjectTypeDto::name))
            .toList());
  }

  @GetMapping(path = "/hierarchy")
  @Operation(summary = "Get the tree of all objecttypes")
  @Transactional(readOnly = true)
  public GetObjectTypesHierarchyResponse getObjectTypesHierarchy() {
    if (!inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.OBJECT_TYPE_HIERARCHY)) {
      throw new BadRequestException("Feature toggle for object type hierarchy is not enabled!");
    }
    return new GetObjectTypesHierarchyResponse(
        objectTypeHierarchyTreeNodeRepository
            .findByRootNode(true)
            .map(ObjectTypeMapper::toDto)
            .orElseThrow());
  }

  @GetMapping(path = "/{id}")
  @Operation(summary = "Get details of an objecttype")
  @Transactional(readOnly = true)
  public SingleObjectTypeResponse getObjectType(@PathVariable("id") UUID id) {
    ObjectType objectType =
        objectTypeRepository.findById(id).orElseThrow(() -> new NotFoundException("ObjectType"));
    ObjectType savedObjectType = objectTypeRepository.save(objectType);
    ObjectTypeDto dto = ObjectTypeMapper.toDto(savedObjectType);
    return new SingleObjectTypeResponse(dto);
  }

  @PutMapping(path = "/{id}")
  @Operation(summary = "Update settings of an objecttype")
  @Transactional
  public SingleObjectTypeResponse updateObjectType(
      @PathVariable("id") UUID id, @Valid @RequestBody UpdateObjectTypeRequest request) {
    ObjectType currentObjectType =
        objectTypeRepository.findById(id).orElseThrow(() -> new NotFoundException("ObjectType"));
    Integer oldRoutineInterval = currentObjectType.getRoutineInterval();
    Integer oldComplaintInterval = currentObjectType.getComplaintInterval();

    ObjectType changedObjectType = ObjectTypeMapper.mapUpdateRequest(request, currentObjectType);
    ObjectType savedObjectType = objectTypeRepository.save(changedObjectType);

    if (inspectionFeatureToggle.isNewFeatureEnabled(InspectionFeature.OBJECT_TYPE_HIERARCHY)) {

      Integer newRoutineInterval = savedObjectType.getRoutineInterval();
      Integer newComplaintInterval = savedObjectType.getComplaintInterval();

      Instant now = clock.instant();

      if (oldRoutineInterval == null && newRoutineInterval != null) {
        List<Facility> facilities =
            facilityRepository.findFacilitiesByObjectTypeWithInspectionsBefore(
                savedObjectType, now);
        createOverdueBackfillInspections(savedObjectType, facilities, InspectionType.REGULAR);
      }

      if (oldComplaintInterval == null && newComplaintInterval != null) {
        List<Facility> facilities =
            facilityRepository.findFacilitiesByObjectTypeWithResultInLastInspectionBefore(
                savedObjectType, now, InspectionResult.SUCCESSFUL_WITH_INCIDENTS);
        createOverdueBackfillInspections(
            savedObjectType, facilities, InspectionType.REGULAR_AFTER_INCIDENTS);
      }
    } else {
      int routineIntervalDifference = savedObjectType.getRoutineInterval() - oldRoutineInterval;
      int complaintIntervalDifference =
          savedObjectType.getComplaintInterval() - oldComplaintInterval;

      if (routineIntervalDifference != 0) {
        log.info(
            "Routine interval of object type {} / {} has changed. Updating inspection appointments.",
            savedObjectType.getId(),
            savedObjectType.getName());
        inspectionService.updateInspectionsWithChangedIntervals(
            savedObjectType, routineIntervalDifference, InspectionType.REGULAR);
      }
      if (complaintIntervalDifference != 0) {
        log.info(
            "Complaint interval of object type {} / {} has changed. Updating inspection appointments.",
            savedObjectType.getId(),
            savedObjectType.getName());
        inspectionService.updateInspectionsWithChangedIntervals(
            savedObjectType, complaintIntervalDifference, InspectionType.REGULAR_AFTER_INCIDENTS);
      }
    }

    ObjectTypeDto dto = ObjectTypeMapper.toDto(savedObjectType);
    return new SingleObjectTypeResponse(dto);
  }

  private void createOverdueBackfillInspections(
      ObjectType savedObjectType, List<Facility> facilities, InspectionType inspectionType) {

    String stdDurationWarnMessage;
    String noPrecedingLogMessage;
    String noFollowupLogMessage;
    String openInspectionLogMessage;

    switch (inspectionType) {
      case REGULAR -> {
        stdDurationWarnMessage =
            "Standard duration missing or invalid for object type {} / {}. Skipping creation of inspections.";
        noPrecedingLogMessage =
            "Skipping overdue backfill for facility {} because no preceding inspection found";
        noFollowupLogMessage =
            "Skipping overdue backfill for facility {} because no follow-up appointment could be computed";
        openInspectionLogMessage =
            "Skipping overdue backfill for facility {} due to open inspection: {}";
      }
      case REGULAR_AFTER_INCIDENTS -> {
        stdDurationWarnMessage =
            "Standard duration missing or invalid for object type {} / {}. Skipping creation of overdue after-incident inspections.";
        noPrecedingLogMessage =
            "Skipping overdue after-incident backfill for facility {} because no preceding inspection found";
        noFollowupLogMessage =
            "Skipping overdue after-incident backfill for facility {} because no follow-up appointment could be computed";
        openInspectionLogMessage =
            "Skipping overdue after-incident backfill for facility {} due to open inspection: {}";
      }
      default ->
          throw new IllegalArgumentException("Unsupported inspection type: " + inspectionType);
    }

    Integer stdDuration = savedObjectType.getStandardDuration();
    if (stdDuration == null || stdDuration <= 0) {
      log.warn(stdDurationWarnMessage, savedObjectType.getId(), savedObjectType.getName());
      return;
    }
    for (Facility facility : facilities) {
      try {
        Inspection newestOpen = inspectionRepository.findNewestOpenInspectionForFacility(facility);
        if (newestOpen != null) {
          throw new BadRequestException("Open inspection exists");
        }
        Inspection precedingInspection =
            inspectionRepository.findNewestClosedInspectionForFacility(facility);
        if (precedingInspection == null) {
          log.info(noPrecedingLogMessage, facility.getId());
          continue;
        }
        Inspection inspection =
            inspectionFinalizer.createFollowupInspectionIfApplicable(precedingInspection);
        if (inspection == null) {
          log.info(noFollowupLogMessage, facility.getId());
          continue;
        }
        inspection.setType(inspectionType);
        InspectionAppointment appt = new InspectionAppointment();
        Instant roundedStart = computeBackfillStartInstant(facility);
        appt.setAppointmentStart(roundedStart);
        appt.setAppointmentEnd(roundedStart.plus(stdDuration, ChronoUnit.HOURS));
        inspection.setPlannedAppointment(appt);
      } catch (BadRequestException e) {
        log.info(openInspectionLogMessage, facility.getId(), e.getMessage());
      }
    }
  }

  private Instant computeBackfillStartInstant(
      de.eshg.inspection.facility.persistence.Facility facility) {
    // Determine a rounded start instant for backfilled inspections.
    // Strategy: use time-of-day from the last closed inspection if available (rounded to full
    // hour),
    // otherwise default to 09:00 local time. Always schedule for "yesterday" in the clock's zone.
    ZoneId zone = clock.getZone();
    LocalDate yesterday = LocalDate.now(clock).minusDays(1);

    LocalTime timeOfDay = LocalTime.of(9, 0);
    try {
      Inspection lastClosed = inspectionRepository.findNewestClosedInspectionForFacility(facility);
      if (lastClosed != null) {
        Instant base = null;
        InspectionAppointment planned = lastClosed.getPlannedAppointment();
        if (lastClosed.getExecutionAppointment() != null
            && lastClosed.getExecutionAppointment().getAppointmentStart() != null) {
          base = lastClosed.getExecutionAppointment().getAppointmentStart();
        } else if (planned != null && planned.getAppointmentStart() != null) {
          base = planned.getAppointmentStart();
        }
        if (base != null) {
          LocalDateTime ldt = LocalDateTime.ofInstant(base, zone);
          // Round down to full hour
          timeOfDay = LocalTime.of(ldt.getHour(), 0);
        }
      }
    } catch (Exception ex) {
      // If anything goes wrong, fall back to 09:00.
    }
    return yesterday.atTime(timeOfDay).atZone(zone).toInstant();
  }
}
