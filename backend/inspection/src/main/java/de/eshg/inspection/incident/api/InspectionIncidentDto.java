/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.incident.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "InspectionIncident")
public record InspectionIncidentDto(
    @NotNull UUID inspectionId,
    @NotNull UUID incidentId,
    @NotNull String title,
    @NotNull String description,
    Integer checklistNumber,
    Integer sectionNumber,
    Integer elementNumber) {}
