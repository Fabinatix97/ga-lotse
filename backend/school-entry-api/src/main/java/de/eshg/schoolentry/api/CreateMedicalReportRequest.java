/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateMedicalReportRequest(
    @NotNull @Size(min = 1, max = 8500) String remark, @NotNull boolean isVisio) {}
