/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "PatchAdditionalInfoRequest")
public record PatchAdditionalInfoRequest(
    @NotNull @Valid ConcernDto concern,
    UUID physicianId,
    LocalDate cutOffDate,
    Boolean sendEmailNotifications) {}
