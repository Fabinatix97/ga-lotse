/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.api;

import de.eshg.officialmedicalservice.appointment.api.PostOmsAppointmentRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "PostCitizenProcedureRequest")
public record PostCitizenProcedureRequest(
    @NotNull @Valid ConcernDto concern,
    @NotNull @Valid PostOmsAppointmentRequest appointment,
    @NotNull @Valid AffectedPersonDto affectedPerson) {}
