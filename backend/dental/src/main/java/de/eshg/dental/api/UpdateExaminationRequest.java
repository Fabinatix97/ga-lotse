/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record UpdateExaminationRequest(
    @NotNull long version, String note, @Valid ExaminationResultDto result) {
  public UpdateExaminationRequest(long version, String note) {
    this(version, note, null);
  }
}
