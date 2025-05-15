/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "SchoolInfoLetterEyeExaminationInfo")
public record SchoolInfoLetterEyeExaminationInfoDto(
    @NotNull boolean conspicuous,
    @NotNull boolean clarificationArranged,
    @NotNull boolean spectacleWearer,
    @NotNull boolean underTreatment,
    @NotNull boolean colorSenseDisorder) {}
