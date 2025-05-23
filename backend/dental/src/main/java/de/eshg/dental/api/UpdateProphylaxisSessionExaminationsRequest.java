/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
