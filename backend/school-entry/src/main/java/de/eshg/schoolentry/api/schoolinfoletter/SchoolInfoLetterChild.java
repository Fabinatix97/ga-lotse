/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import jakarta.validation.constraints.NotBlank;

public record SchoolInfoLetterChild(@NotBlank String name, @NotBlank String dateOfBirth) {}
