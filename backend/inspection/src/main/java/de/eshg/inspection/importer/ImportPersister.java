/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.importer;

import static java.time.temporal.ChronoUnit.HOURS;
import static org.apache.commons.lang3.StringUtils.isBlank;

import de.eshg.base.centralfile.api.DataOriginDto;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateRequest;
import de.eshg.base.centralfile.api.facility.AddFacilityFileStateResponse;
import de.eshg.inspection.facility.FacilityClient;
import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.facility.persistence.FacilityRepository;
import de.eshg.inspection.incident.persistence.InspectionIncident;
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
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ImportPersister {
  private final InspectionRepository inspectionRepository;
  private final FacilityRepository facilityRepository;
  private final ObjectTypeRepository objectTypeRepository;
  private final FacilityClient facilityClient;
  private final AuditLogger auditLogger;
  private final Clock clock;

  ImportPersister(
      InspectionRepository inspectionRepository,
      FacilityRepository facilityRepository,
      ObjectTypeRepository objectTypeRepository,
      FacilityClient facilityClient,
      AuditLogger auditLogger,
      Clock clock) {
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

  UUID addBaseFacility(ImportInspectionFacility importFacility, UUID facilityReferenceId) {
    AddFacilityFileStateResponse response =
        facilityClient.addFacilityFileState(
            new AddFacilityFileStateRequest(
                facilityReferenceId, importFacility.facilityDetailsDto(), DataOriginDto.IMPORT));
    return response.id();
  }

  UUID getReferenceFacilityId(UUID centralFileStateId) {
    return facilityClient.getReferenceFacility(centralFileStateId).id();
  }

  Facility addInspectionFacility(ImportInspectionFacility importFacility, UUID centralFileStateId) {
    Facility facility = new Facility(importFacility.objectType(), centralFileStateId);
    return facilityRepository.save(facility);
  }

  Inspection addInspection(
      ImportInspection importInspection,
      String facilityName,
      Facility facility,
      UUID centralFileStateId) {
    UUID currentUserId = CurrentUserHelper.getCurrentUserId();
    Integer standardDuration = facility.getObjectType().getStandardDuration();
    Instant appointmentStart = importInspection.lastInspected();
    Instant appointmentEnd = appointmentStart.plus(standardDuration, HOURS);
    Clock clockStart = Clock.fixed(appointmentStart, clock.getZone());
    Clock clockEnd = Clock.fixed(appointmentEnd, clock.getZone());

    Inspection inspection = new Inspection();
    inspection.setProcedureType(ProcedureType.INSPECTION);
    inspection.setType(InspectionType.REGULAR); // TODO: change to IMPORTED later
    inspection.setPhase(InspectionPhase.CLOSED);
    inspection.setModifiedBy(currentUserId);
    inspection.setResult(importInspection.result());
    inspection.updateProcedureStatus(ProcedureStatus.CLOSED, clockEnd, auditLogger);

    InspectionRelatedFacility inspectionRelatedFacility = new InspectionRelatedFacility();
    inspectionRelatedFacility.setCentralFileStateId(centralFileStateId);
    inspectionRelatedFacility.setFacilityType(FacilityType.INSPECTION);
    inspectionRelatedFacility.setProcedure(inspection);
    inspectionRelatedFacility.setFacility(facility);
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
    ChecklistReportMapper.addTopLevelTitle(report, facilityName);
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

    return inspectionRepository.save(inspection);
  }
}
