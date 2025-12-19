/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointment;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

public record OmsProcedureView(
    @NotNull OmsProcedure procedure,
    @Nullable Concern concern,
    @Nullable OmsAppointment appointment) {}
