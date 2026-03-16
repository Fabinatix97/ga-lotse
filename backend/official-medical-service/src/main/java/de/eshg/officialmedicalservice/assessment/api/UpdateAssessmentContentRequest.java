/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.assessment.api;

import jakarta.validation.constraints.NotNull;

public record UpdateAssessmentContentRequest(
    @NotNull String jsonContent, @NotNull String htmlContent) {}
