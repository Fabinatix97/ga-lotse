/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.pdf;

import jakarta.validation.constraints.NotNull;

public record PersonData(
    @NotNull String firstName,
    @NotNull String lastName,
    @NotNull String dateOfBirth,
    String alias,
    @NotNull String nationality) {}
