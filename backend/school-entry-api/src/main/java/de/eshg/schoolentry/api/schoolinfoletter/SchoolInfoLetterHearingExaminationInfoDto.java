/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "SchoolInfoLetterHearingExaminationInfo")
public record SchoolInfoLetterHearingExaminationInfoDto(
    @NotNull boolean conspicuous,
    @NotNull boolean clarificationArranged,
    @NotNull boolean underTreatment) {}
