/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import static java.time.temporal.ChronoUnit.DAYS;
import static java.time.temporal.ChronoUnit.HOURS;
import static org.apache.commons.lang3.StringUtils.isBlank;

import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.base.centralfile.api.facility.GetReferenceFacilityResponse;
import de.eshg.base.centralfile.api.facility.SearchReferenceFacilitiesResponse;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.facility.persistence.FacilityRepository;
import de.eshg.inspection.incident.persistence.InspectionIncident;
import de.eshg.inspection.inspection.ReviewService;
import de.eshg.inspection.inspection.api.InspectionPhase;
import de.eshg.inspection.inspection.api.InspectionType;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.inspection.inspection.persistence.InspectionAppointment;
import de.eshg.inspection.inspection.persistence.InspectionRelatedFacility;
import de.eshg.inspection.inspection.persistence.InspectionRepository;
import de.eshg.inspection.inspection.persistence.InspectionTask;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.objecttype.persistence.ObjectTypeRepository;
import de.eshg.inspection.report.InspectionReportService;
import de.eshg.inspection.report.mapper.ChecklistReportMapper;
import de.eshg.inspection.report.persistence.Report;
import de.eshg.inspection.report.persistence.element.ReportElementText;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.FacilityType;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.lib.procedure.domain.model.TaskStatus;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.time.Clock;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ImportPersister {

  private static final Logger log = LoggerFactory.getLogger(ImportPersister.class);

  private final ReviewService reviewService;
  private final InspectionRepository inspectionRepository;
  private final FacilityRepository facilityRepository;
  private final ObjectTypeRepository objectTypeRepository;
  private final FacilityClient facilityClient;
  private final AuditLogger auditLogger;
  private final Clock clock;

  ImportPersister(
      ReviewService reviewService,
      InspectionRepository inspectionRepository,
      FacilityRepository facilityRepository,
      ObjectTypeRepository objectTypeRepository,
      FacilityClient facilityClient,
      AuditLogger auditLogger,
      Clock clock) {
    this.reviewService = reviewService;
    this.inspectionRepository = inspectionRepository;
    this.facilityRepository = facilityRepository;
    this.objectTypeRepository = objectTypeRepository;
    this.facilityClient = facilityClient;
    this.auditLogger = auditLogger;
    this.clock = clock;
  }

  Set<UUID> fetchExistingProcedureIds(List<UUID> procedureIds) {
    if (procedureIds.isEmpty()) {
      return Set.of();
    } else {
      List<UUID> list = inspectionRepository.collectExistingProceduresByExternalIds(procedureIds);
      return new HashSet<>(list);
    }
  }

  Optional<ObjectType> findObjectType(String objectTypeName) {
    return objectTypeRepository.findByName(objectTypeName);
  }

  record FacilitySearchParams(String facilityName) {}

  /**
   * Search the central file db for a set of facility names.
   *
   * @param attributes the facility names to search for
   * @param resultMap response map, where to add the result to
   */
  void batchSearchForFacilityDuplicates(
      Set<FacilitySearchParams> attributes,
      Map<FacilitySearchParams, SearchReferenceFacilitiesResponse> resultMap) {
    // TODO: currently there is no batch search; we must search sequentially
    log.info("Calling searchReferenceFacilities for {} facility names...", attributes.size());
    long start = System.currentTimeMillis();
    for (FacilitySearchParams attribute : attributes) {
      SearchReferenceFacilitiesResponse response =
          facilityClient.searchReferenceFacilities(attribute.facilityName());
      resultMap.put(attribute, response);
    }
    long end = System.currentTimeMillis();
    log.info(
        "Calling searchReferenceFacilities for {} facility names took {}ms",
        attributes.size(),
        end - start);
  }

  private UUID addBaseFacility(ImportInspectionFacility importFacility, UUID facilityReferenceId) {
    AddFacilityFileStateResponse response =
        facilityClient.addFacilityFileState(
            new AddFacilityFileStateRequest(
                facilityReferenceId, importFacility.facilityDetailsDto(), DataOriginDto.IMPORT));
    return response.id();
  }

  UUID getReferenceFacilityId(UUID centralFileStateId) {
    return facilityClient.getReferenceFacility(centralFileStateId).id();
  }

  /** inspection facility and its corresponding base facility reference id. */
  record FacilityRef(Facility facility, UUID facilityReferenceId, boolean isNew) {}

  /** Add a completely new base facility and inspection facility. */
  FacilityRef addBaseFacilityAndInspectionFacility(
      ImportInspectionFacility importFacility, boolean hasPossibleDuplicates) {
    UUID centralFileStateId = addBaseFacility(importFacility, null);
    UUID referenceFacilityId = getReferenceFacilityId(centralFileStateId);
    Facility facility = new Facility(importFacility.objectType(), centralFileStateId);
    facility.setPossibleDuplicates(hasPossibleDuplicates);
    facility = facilityRepository.save(facility);
    return new FacilityRef(facility, referenceFacilityId, true);
  }

  /**
   * Add a new inspection facility for a given base reference facility, but check first if we might
   * have an inspection facility for that base facility already. In the latter case return the
   * inspection facility with its reference id.
   */
  FacilityRef addInspectionFacilityForReferenceFacilityIfMissing(
      GetReferenceFacilityResponse baseFacility,
      ObjectType objectType,
      boolean hasPossibleDuplicates) {
    Facility facility;
    boolean isNew;
    Optional<Facility> existingFacility =
        reviewService.findInspectionFacilityForBaseReferenceId(baseFacility.id());
    if (existingFacility.isPresent()) {
      facility = existingFacility.get();
      isNew = false;
    } else {
      facility = addInspectionFacility(baseFacility, objectType);
      isNew = true;
    }
    facility.setPossibleDuplicates(hasPossibleDuplicates);
    // the inspection facility found in the previous step could be missing an object type, if the
    // facility is associated with a DRAFT procedure only. In this case, assign the objectType from
    // the import row:
    if (facility.getObjectType() == null) {
      facility.setObjectType(objectType);
    }
    return new FacilityRef(facility, baseFacility.id(), isNew);
  }

  /** Add an inspection facility for an existing base facility. */
  private Facility addInspectionFacility(
      GetReferenceFacilityResponse baseFacility, ObjectType objectType) {
    AddFacilityFileStateResponse fileState =
        facilityClient.addFacilityFileState(
            new AddFacilityFileStateRequest(baseFacility, DataOriginDto.IMPORT));
    Facility facility = new Facility(objectType, fileState.id());
    return facilityRepository.save(facility);
  }

  Inspection addInspection(
      ImportInspection importInspection,
      ImportInspectionFacility importFacility,
      FacilityRef facilityRef,
      Long firstImportedInspectionId) {
    // create new fileState for inspection first
    UUID centralFileStateId = addBaseFacility(importFacility, facilityRef.facilityReferenceId);

    UUID currentUserId = CurrentUserHelper.getCurrentUserId();
    Integer standardDuration = facilityRef.facility.getObjectType().getStandardDuration();
    Instant appointmentStart = importInspection.lastInspected();
    Instant appointmentEnd = appointmentStart.plus(standardDuration, HOURS);
    Clock clockStart = Clock.fixed(appointmentStart, clock.getZone());
    Clock clockEnd = Clock.fixed(appointmentEnd, clock.getZone());

    Inspection inspection = new Inspection();
    inspection.setProcedureType(ProcedureType.INSPECTION);
    inspection.setType(InspectionType.IMPORT);
    inspection.setPhase(InspectionPhase.CLOSED);
    inspection.setCreatedAt(clockStart.instant());
    inspection.setModifiedBy(currentUserId);
    inspection.setResult(importInspection.result());
    inspection.updateProcedureStatus(ProcedureStatus.CLOSED, clockEnd, auditLogger);

    InspectionRelatedFacility inspectionRelatedFacility = new InspectionRelatedFacility();
    inspectionRelatedFacility.setCentralFileStateId(centralFileStateId);
    inspectionRelatedFacility.setFacilityType(FacilityType.INSPECTION);
    inspectionRelatedFacility.setProcedure(inspection);
    inspectionRelatedFacility.setFacility(facilityRef.facility);
    inspection.addRelatedFacility(inspectionRelatedFacility);

    InspectionTask task1 = inspection.createPlanningTask(currentUserId, clockStart);
    InspectionTask task2 = inspection.createExecutionTask(clockStart);
    InspectionTask task3 = inspection.createReportTask(clockStart);
    task1.setTaskStatus(TaskStatus.CLOSED);
    task2.setTaskStatus(TaskStatus.CLOSED);
    task3.setTaskStatus(TaskStatus.CLOSED);

    InspectionAppointment plannedAppointment = new InspectionAppointment();
    plannedAppointment.setAppointmentStart(appointmentStart);
    plannedAppointment.setAppointmentEnd(appointmentEnd);
    inspection.setPlannedAppointment(plannedAppointment);

    InspectionAppointment executionAppointment = new InspectionAppointment();
    executionAppointment.setAppointmentStart(appointmentStart);
    executionAppointment.setAppointmentEnd(appointmentEnd);
    inspection.setExecutionAppointment(executionAppointment);

    if (!isBlank(importInspection.incidents())) {
      InspectionIncident inspectionIncident = new InspectionIncident();
      inspectionIncident.setIncidentExternalId(UUID.randomUUID());
      inspectionIncident.setTitle("Importiertes Vorkommnis");
      inspectionIncident.setDescription(importInspection.incidents());
      inspectionIncident.setManualPosition(0);
      inspection.addIncident(inspectionIncident);
    }

    Report report = new Report();
    ChecklistReportMapper.addTopLevelTitle(report);
    InspectionReportService.addDateOfInspection(report, inspection, clock);
    ReportElementText hint = new ReportElementText();
    hint.setText("Dieser Vorgang wurde importiert.");
    hint.setEditable(false);
    hint.setMoveable(false);
    hint.setDeletable(false);
    report.getReportElements().add(hint);
    InspectionReportService.adjustPositions(report);
    report.setInspection(inspection);
    inspection.setReport(report);

    checkForInspectionDuplicates(inspection, firstImportedInspectionId);

    return inspectionRepository.save(inspection);
  }

  public void checkForInspectionDuplicates(Inspection inspection, Long firstImportedInspectionId) {
    List<UUID> centralFileStateIds =
        facilityClient.getFacilityFileStateIdsWithSameReferenceFacility(
            inspection.getCentralFileStateId());

    Instant inspectedAt = inspection.getExecutionAppointment().getAppointmentStart();
    Instant startTime = inspectedAt.truncatedTo(DAYS);
    Instant endTime = startTime.plus(1, DAYS);

    List<Inspection> possibleInspectionDuplicates =
        inspectionRepository.findByCentralFileStateIdsAndAppointmentAndIdIsLessThan(
            centralFileStateIds, startTime, endTime, firstImportedInspectionId);

    inspection.getPossibleDuplicates().addAll(possibleInspectionDuplicates);
  }
}
