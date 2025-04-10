/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
