/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import de.eshg.validation.constraints.DateOfBirth;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public record CreateProstituteProtectionProcedureRequest(
    @Size(min = 1, max = 80) String firstName,
    @NotNull @Size(min = 1, max = 120) String lastName,
    @DateOfBirth LocalDate dateOfBirth,
    String alias,
    @NotNull List<LanguageDto> languages,
    ConsultationTypeDto consultationType) {}
