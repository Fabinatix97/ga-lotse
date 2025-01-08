/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

public record PatchVaccinationRequest(
    @NotNull @Size(max = 200) String batchIdentifier,
    @NotNull LocalDate appliedAt,
    @NotNull UUID physician,
    UUID mfa) {}
