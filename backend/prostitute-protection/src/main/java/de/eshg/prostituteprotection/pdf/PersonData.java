/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.pdf;

import jakarta.validation.constraints.NotNull;

public record PersonData(
    @NotNull String firstName,
    @NotNull String lastName,
    @NotNull String dateOfBirth,
    String alias) {}
