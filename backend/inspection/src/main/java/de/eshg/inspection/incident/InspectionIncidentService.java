/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.incident;

import static de.eshg.inspection.inspection.InspectionUtils.checkInspectionIsNotClosed;

import de.eshg.inspection.incident.api.CreateInspectionIncidentRequest;
import de.eshg.inspection.incident.api.GetInspectionIncidentsResponse;
import de.eshg.inspection.incident.api.InspectionIncidentDto;
import de.eshg.inspection.incident.api.UpdateInspectionIncidentRequest;
import de.eshg.inspection.incident.persistence.InspectionIncident;
import de.eshg.inspection.inspection.InspectionMapper;
import de.eshg.inspection.inspection.InspectionService;
import de.eshg.inspection.inspection.InspectionUpdater;
import de.eshg.inspection.inspection.persistence.Inspection;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.NotFoundException;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class InspectionIncidentService {

  private final InspectionService inspectionService;
  private final InspectionUpdater inspectionUpdater;

  public InspectionIncidentService(
      InspectionService inspectionService, InspectionUpdater inspectionUpdater) {
    this.inspectionService = inspectionService;
    this.inspectionUpdater = inspectionUpdater;
  }

  public GetInspectionIncidentsResponse getIncidents(UUID inspectionId) {
    Inspection inspection = inspectionService.loadInspection(inspectionId);
    List<InspectionIncidentDto> incidentDtos = InspectionMapper.mapIncidents(inspection);
    return new GetInspectionIncidentsResponse(incidentDtos);
  }

  public InspectionIncidentDto createIncident(
      UUID inspectionId, CreateInspectionIncidentRequest request) {
    Inspection inspection = inspectionService.loadInspectionForUpdate(inspectionId);
    checkInspectionIsNotClosed(
        inspection,
        "Vorkommnisse können nicht zu abgeschlossenen Vorgängen hinzugefügt werden.",
        "incident could not be added");

    int newPosition =
        inspection.getIncidents().stream()
            .map(InspectionIncident::getManualPosition)
            .filter(Objects::nonNull)
            .max(Comparator.naturalOrder())
            .map(maxPosition -> maxPosition + 1)
            .orElse(0);

    InspectionIncident incident = new InspectionIncident();
    incident.setIncidentExternalId(request.externalId());
    incident.setTitle(request.title());
    incident.setDescription(request.description());
    inspection.getIncidents().add(incident);
    incident.setInspection(inspection);
    incident.setManualPosition(newPosition);

    inspectionUpdater.advanceToExecutingPhase(inspection);
    inspectionUpdater.updateModified(inspection);

    return InspectionIncidentMapper.mapToDto(incident);
  }

  public InspectionIncidentDto updateIncident(
      UUID inspectionId, UUID incidentId, UpdateInspectionIncidentRequest request) {
    Inspection inspection = inspectionService.loadInspectionForUpdate(inspectionId);
    checkInspectionIsNotClosed(
        inspection,
        "Vorkommnisse von abgeschlossenen Vorgängen können nicht geändert werden.",
        "incident could not be updated");
    InspectionIncident inspectionIncident = findInspectionIncident(inspection, incidentId);

    String title = request.title();
    String description = request.description();

    if (inspectionIncident.getChecklistElement() != null && title != null) {
      throw new BadRequestException("Not allowed to update title for checklist incident");
    }
    if (title != null) {
      inspectionIncident.setTitle(title);
    }
    if (description != null) {
      inspectionIncident.setDescription(description);
    }

    inspectionUpdater.advanceToExecutingPhase(inspection);
    inspectionUpdater.updateModified(inspection);

    return InspectionIncidentMapper.mapToDto(inspectionIncident);
  }

  public void deleteIncident(UUID inspectionId, UUID incidentId) {
    Inspection inspection = inspectionService.loadInspectionForUpdate(inspectionId);
    checkInspectionIsNotClosed(
        inspection,
        "Vorkommnisse von abgeschlossenen Vorgängen können nicht gelöscht werden.",
        "incident could not be deleted");
    InspectionIncident incident = findInspectionIncident(inspection, incidentId);
    if (incident.getChecklistElement() != null) {
      throw new BadRequestException("Not allowed to delete checklist incident");
    }
    inspection.getIncidents().remove(incident);
    adjustPosition(inspection.getIncidents(), incident.getManualPosition());

    inspectionUpdater.advanceToExecutingPhase(inspection);
    inspectionUpdater.updateModified(inspection);
  }

  private static InspectionIncident findInspectionIncident(Inspection inspection, UUID incidentId) {
    return inspection.getIncidents().stream()
        .filter(inspectionIncident -> inspectionIncident.getIncidentExternalId().equals(incidentId))
        .findAny()
        .orElseThrow(
            () -> new NotFoundException("Incident not found for id: %s".formatted(incidentId)));
  }

  private static void adjustPosition(List<InspectionIncident> incidents, int deletedPosition) {
    List<InspectionIncident> manualIncidents =
        incidents.stream().filter(incident -> incident.getManualPosition() != null).toList();
    for (int i = deletedPosition; i < manualIncidents.size(); i++) {
      manualIncidents.get(i).setManualPosition(i);
    }
  }
}
