/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record ProstituteProtectionProcedurePersonSearchParameters(
    @NotNull String firstName, @NotNull String lastName, @NotNull LocalDate dateOfBirth) {}
