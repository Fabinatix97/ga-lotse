/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.assessment.api;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateAssessmentTitleAndTypeRequest(
    @NotNull @Size(min = 1, max = 60) String title, @NotNull AssessmentTypeDto assessmentType) {}
