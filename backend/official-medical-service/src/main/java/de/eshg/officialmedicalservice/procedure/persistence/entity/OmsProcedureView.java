/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointment;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

public record OmsProcedureView(
    @NotNull OmsProcedure procedure,
    @Nullable Concern concern,
    @Nullable OmsAppointment appointment) {}
