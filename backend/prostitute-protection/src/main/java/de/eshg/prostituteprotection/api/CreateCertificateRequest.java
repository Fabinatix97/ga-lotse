/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import de.eshg.validation.constraints.DateOfBirth;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CreateCertificateRequest(
    @NotNull @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @NotNull @DateOfBirth LocalDate dateOfBirth,
    @NotNull boolean withAlias,
    @NotNull boolean withRegistrationCertificate) {}
