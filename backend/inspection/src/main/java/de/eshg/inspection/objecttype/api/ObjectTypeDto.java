/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype.api;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(name = "ObjectType")
public record ObjectTypeDto(
    @NotNull UUID id,
    @NotNull String name,
    @Schema(nullable = true) @Min(1) @Max(9999) Integer routineInterval,
    @Schema(nullable = true) @Min(1) @Max(9999) Integer complaintInterval,
    @Min(1) @Max(99) Integer standardDuration,
    @Min(0) @Max(9999) Integer standardBufferTime,
    @NotNull boolean emailAnnouncement,
    String legalBasis,
    @Schema(nullable = true) @JsonInclude(JsonInclude.Include.NON_NULL) UUID designatedAssigneeId,
    @Schema(nullable = true) @JsonInclude(JsonInclude.Include.NON_NULL)
        String designatedAssigneeName) {}
