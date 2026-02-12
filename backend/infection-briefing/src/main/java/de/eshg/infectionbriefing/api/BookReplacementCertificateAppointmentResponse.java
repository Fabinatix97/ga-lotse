/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record BookReplacementCertificateAppointmentResponse(
    @NotNull @Valid AppointmentDto appointment, @NotNull boolean emailSent) {}
