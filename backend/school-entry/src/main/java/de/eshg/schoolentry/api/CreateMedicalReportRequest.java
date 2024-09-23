/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateMedicalReportRequest(
    @NotNull @Size(min = 1, max = 600) String remark, @NotNull boolean isVisio) {}
