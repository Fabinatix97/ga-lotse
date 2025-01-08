/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateLabelRequest(@NotBlank @Size(max = 255) String name, String description) {
  public CreateLabelRequest(String name) {
    this(name, null);
  }
}
