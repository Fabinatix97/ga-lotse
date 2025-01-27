/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record UpdateProphylaxisSessionExaminationsRequest(
    @NotEmpty @Valid List<UpdateExaminationsInBulkRequest> examinationUpdates) {}
