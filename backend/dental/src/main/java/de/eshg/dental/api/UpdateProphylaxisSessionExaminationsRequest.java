/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record UpdateProphylaxisSessionExaminationsRequest(
    @NotNull @Valid List<UpdateExaminationsInBulkRequest> examinationUpdates,
    @NotNull @Valid List<UpdateChildDetailsInBulkRequest> childUpdates) {
  public UpdateProphylaxisSessionExaminationsRequest(
      List<UpdateExaminationsInBulkRequest> examinationUpdates) {
    this(examinationUpdates, List.of());
  }
}
