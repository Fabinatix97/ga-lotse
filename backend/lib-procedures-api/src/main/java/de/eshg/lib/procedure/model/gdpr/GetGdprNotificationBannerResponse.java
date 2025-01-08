/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model.gdpr;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record GetGdprNotificationBannerResponse(
    @NotNull @Min(0) int openValidationTasksCount, LocalDate earliestDueDate) {}
