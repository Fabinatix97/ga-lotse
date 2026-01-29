/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype.api;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

public record UpdateObjectTypeRequest(
    @Schema(nullable = true) Integer routineInterval,
    @Schema(nullable = true) Integer complaintInterval,
    Integer standardDuration,
    Integer standardBufferTime,
    Boolean emailAnnouncement,
    String legalBasis,
    @Schema(nullable = true) UUID designatedAssigneeId) {

  public UpdateObjectTypeRequest(
      Integer routineInterval,
      Integer complaintInterval,
      Integer standardDuration,
      Integer standardBufferTime,
      Boolean emailAnnouncement,
      String legalBasis) {
    this(
        routineInterval,
        complaintInterval,
        standardDuration,
        standardBufferTime,
        emailAnnouncement,
        legalBasis,
        null);
  }
}
