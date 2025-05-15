/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype.api;

public record UpdateObjectTypeRequest(
    Integer routineInterval,
    Integer complaintInterval,
    Integer standardDuration,
    Integer standardBufferTime,
    Boolean emailAnnouncement,
    String legalBasis) {}
