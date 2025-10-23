/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import jakarta.validation.constraints.NotBlank;

public record SchoolInfoLetterChild(@NotBlank String name, @NotBlank String dateOfBirth) {}
