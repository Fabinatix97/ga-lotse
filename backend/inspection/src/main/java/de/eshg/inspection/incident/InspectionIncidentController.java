/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.incident;

import de.eshg.inspection.incident.api.CreateInspectionIncidentRequest;
import de.eshg.inspection.incident.api.GetInspectionIncidentsResponse;
import de.eshg.inspection.incident.api.InspectionIncidentDto;
import de.eshg.inspection.incident.api.UpdateInspectionIncidentRequest;
import de.eshg.rest.service.security.config.BaseUrls;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    path = InspectionIncidentController.BASE_URL,
    produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "InspectionIncident")
public class InspectionIncidentController {

  public static final String BASE_URL =
      BaseUrls.Inspection.INSPECTION_CONTROLLER + "/{inspectionId}/incidents";

  private final InspectionIncidentService inspectionIncidentService;

  public InspectionIncidentController(InspectionIncidentService inspectionIncidentService) {
    this.inspectionIncidentService = inspectionIncidentService;
  }

  @GetMapping
  @Operation(summary = "Get all incidents of an inspection")
  @Transactional(readOnly = true)
  public GetInspectionIncidentsResponse getIncidents(
      @PathVariable("inspectionId") UUID inspectionId) {
    return inspectionIncidentService.getIncidents(inspectionId);
  }

  @PostMapping
  @Operation(summary = "Creates a new incident")
  @Transactional
  public InspectionIncidentDto createIncident(
      @PathVariable("inspectionId") UUID inspectionId,
      @Valid @RequestBody CreateInspectionIncidentRequest request) {
    return inspectionIncidentService.createIncident(inspectionId, request);
  }

  @PutMapping(path = "/{incidentId}")
  @Operation(summary = "Update an incident")
  @Transactional
  public InspectionIncidentDto updateIncident(
      @PathVariable("inspectionId") UUID inspectionId,
      @PathVariable("incidentId") UUID incidentId,
      @Valid @RequestBody UpdateInspectionIncidentRequest request) {
    return inspectionIncidentService.updateIncident(inspectionId, incidentId, request);
  }

  @DeleteMapping(path = "/{incidentId}")
  @Operation(summary = "Delete an incident")
  @Transactional
  public void deleteIncident(
      @PathVariable("inspectionId") UUID inspectionId,
      @PathVariable("incidentId") UUID incidentId) {
    inspectionIncidentService.deleteIncident(inspectionId, incidentId);
  }
}
