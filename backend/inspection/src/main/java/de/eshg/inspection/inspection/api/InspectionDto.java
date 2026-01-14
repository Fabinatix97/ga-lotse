/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.facility.api.InspFacilityDto;
import de.eshg.inspection.incident.api.InspectionIncidentDto;
import de.eshg.lib.procedure.model.ProcedureStatusDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "Inspection")
public record InspectionDto(
    @NotNull UUID externalId,
    @NotNull String title,
    @NotNull ProcedureStatusDto status,
    @NotNull boolean challenging,
    @NotNull @Valid InspFacilityDto facility,
    @NotNull InspectionType type,
    @NotNull InspectionPhase phase,
    @NotNull InspectionResult result,
    @NotNull @Valid List<InspectionCLDVersionDto> selectedChecklistDefinitionVersions,
    @NotNull @Valid List<InspectionPLDRevisionDto> selectedPacklistDefinitionRevisions,
    String notes,
    @NotNull @Valid List<InspectionInventoryDto> inventories,
    @NotNull @Valid List<InspectionResourceDto> resources,
    @Valid InspectionAppointmentDto plannedAppointment,
    @Valid InspectionAppointmentDto executedAppointment,
    @Valid InspectionTravelTimeDto travelTime,
    @Valid InspectionAnnouncementDto announcement,
    UUID reportId,
    @Valid ReportInfoDto reportInfo,
    @Valid InspectionFollowupInfoDto followupInfo,
    @Valid List<InspectionIncidentDto> incidents,
    @Valid UserDto assignee,
    @Valid UserDto lockedByUser,
    @NotNull boolean possibleFacilityDuplicate,
    @NotNull boolean possibleInspectionDuplicate) {

  @Schema(name = "ReportInfo")
  public record ReportInfoDto(
      @NotNull UUID reportId,
      @NotNull Instant reportDate,
      @NotNull UUID creatorUserId,
      @NotNull String fileName,
      @NotNull long fileSize,
      @NotNull UUID fileContentId) {}
}
