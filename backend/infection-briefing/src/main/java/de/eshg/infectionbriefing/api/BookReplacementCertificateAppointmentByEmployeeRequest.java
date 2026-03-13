/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record BookReplacementCertificateAppointmentByEmployeeRequest(
    @NotNull @Valid PersonWithOptionalEmailDto applicant, @NotNull Instant startTime) {}
