/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(name = "UpdateInspectionRequest")
public record UpdateInspectionRequest(
    UUID centralFileStateID,
    Boolean challenging,
    InspectionType type,
    InspectionResult result,
    List<UUID> checklistDefinitionVersionIds,
    List<UUID> packlistDefinitionRevisionIds,
    String notes,
    @Valid UpdateInspectionAppointmentDto plannedAppointment,
    @Valid UpdateInspectionAppointmentDto executedAppointment,
    @Valid UpdateInspectionTravelTimeDto travelTime,
    @Valid InspectionAnnouncementDto announcementDto,
    FollowupType followupType,
    Instant followupDate,
    UUID assigneeId,
    Boolean lock,
    Integer fileNumberSuffix) {

  public static UpdateInspectionRequest forCentralFileStateID(UUID centralFileStateID) {
    return new UpdateInspectionRequest(
        centralFileStateID,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null);
  }

  public static UpdateInspectionRequest forChallenging(Boolean challenging) {
    return new UpdateInspectionRequest(
        null,
        challenging,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null);
  }

  public static UpdateInspectionRequest forType(InspectionType type) {
    return new UpdateInspectionRequest(
        null, null, type, null, null, null, null, null, null, null, null, null, null, null, null,
        null);
  }

  public static UpdateInspectionRequest forChecklistDefinitionVersionId(
      UUID checklistDefinitionVersionId) {
    List<UUID> list = List.of(checklistDefinitionVersionId);
    return new UpdateInspectionRequest(
        null, null, null, null, list, null, null, null, null, null, null, null, null, null, null,
        null);
  }

  public static UpdateInspectionRequest forChecklistDefinitionVersionIds(
      List<UUID> checklistDefinitionVersionIds) {
    return new UpdateInspectionRequest(
        null,
        null,
        null,
        null,
        checklistDefinitionVersionIds,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null);
  }

  public static UpdateInspectionRequest forPacklistDefinitionRevisionId(
      UUID packlistDefinitionVersionId) {
    List<UUID> list = List.of(packlistDefinitionVersionId);
    return forPacklistDefinitionRevisionIds(list);
  }

  public static UpdateInspectionRequest forPacklistDefinitionRevisionIds(
      List<UUID> packlistDefinitionVersionIds) {
    return new UpdateInspectionRequest(
        null,
        null,
        null,
        null,
        null,
        packlistDefinitionVersionIds,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null);
  }

  public static UpdateInspectionRequest forNotes(String notes) {
    return new UpdateInspectionRequest(
        null, null, null, null, null, null, notes, null, null, null, null, null, null, null, null,
        null);
  }

  public static UpdateInspectionRequest forPlannedAppointment(
      UpdateInspectionAppointmentDto plannedAppointment) {
    return new UpdateInspectionRequest(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        plannedAppointment,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null);
  }

  public static UpdateInspectionRequest forCldvAndPlannedAppointment(
      UUID cldvId, UpdateInspectionAppointmentDto plannedAppointment) {
    return new UpdateInspectionRequest(
        null,
        null,
        null,
        null,
        List.of(cldvId),
        null,
        null,
        plannedAppointment,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null);
  }

  public static UpdateInspectionRequest forExecutedAppointment(
      UpdateInspectionAppointmentDto executedAppointment) {
    return new UpdateInspectionRequest(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        executedAppointment,
        null,
        null,
        null,
        null,
        null,
        null,
        null);
  }

  public static UpdateInspectionRequest forAnnouncement(InspectionAnnouncementDto announcement) {
    return new UpdateInspectionRequest(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        announcement,
        null,
        null,
        null,
        null,
        null);
  }

  public static UpdateInspectionRequest forApproval(
      InspectionResult result, FollowupType followupType, Instant followupDate) {
    return new UpdateInspectionRequest(
        null,
        null,
        null,
        result,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        followupType,
        followupDate,
        null,
        null,
        null);
  }

  public static UpdateInspectionRequest forAssignee(UUID assigneeId) {
    return new UpdateInspectionRequest(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        assigneeId,
        null,
        null);
  }

  public static UpdateInspectionRequest forTravelTime(UpdateInspectionTravelTimeDto travelTimeDto) {
    return new UpdateInspectionRequest(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        travelTimeDto,
        null,
        null,
        null,
        null,
        null,
        null);
  }

  public static UpdateInspectionRequest forLock(Boolean lock) {
    return new UpdateInspectionRequest(
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, lock,
        null);
  }

  public static UpdateInspectionRequest forResult(
      InspectionResult inspectionResult, FollowupType followupType, Instant followupDate) {
    return new UpdateInspectionRequest(
        null,
        null,
        null,
        inspectionResult,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        followupType,
        followupDate,
        null,
        null,
        null);
  }

  public static UpdateInspectionRequest forFileNumberSuffix(Integer fileNumberSuffix) {
    return new UpdateInspectionRequest(
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        fileNumberSuffix);
  }
}
