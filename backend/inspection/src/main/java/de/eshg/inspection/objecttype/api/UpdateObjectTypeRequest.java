/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype.api;

import io.swagger.v3.oas.annotations.media.Schema;

public record UpdateObjectTypeRequest(
    @Schema(nullable = true) Integer routineInterval,
    @Schema(nullable = true) Integer complaintInterval,
    Integer standardDuration,
    Integer standardBufferTime,
    Boolean emailAnnouncement,
    String legalBasis) {}
