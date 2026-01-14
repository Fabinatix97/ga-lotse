/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.incident;

import de.eshg.inspection.incident.api.InspectionIncidentDto;
import de.eshg.inspection.incident.persistence.InspectionIncident;

public final class InspectionIncidentMapper {

  private InspectionIncidentMapper() {}

  public static InspectionIncidentDto mapToDto(InspectionIncident inspectionIncident) {
    return new InspectionIncidentDto(
        inspectionIncident.getInspection().getExternalId(),
        inspectionIncident.getIncidentExternalId(),
        inspectionIncident.getTitle(),
        inspectionIncident.getDescription(),
        inspectionIncident.getChecklistNumber(),
        inspectionIncident.getSectionNumber(),
        inspectionIncident.getElementNumber());
  }
}
