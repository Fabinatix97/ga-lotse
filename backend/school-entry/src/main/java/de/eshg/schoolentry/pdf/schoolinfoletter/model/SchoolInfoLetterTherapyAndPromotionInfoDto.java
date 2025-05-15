/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "SchoolInfoLetterTherapyAndPromotionInfo")
public record SchoolInfoLetterTherapyAndPromotionInfoDto(
    @NotNull boolean speechTherapy,
    @NotNull boolean ergoTherapy,
    @NotNull boolean physioTherapy,
    @NotNull boolean psychoMotorSkills,
    @NotNull boolean miscellaneous) {}
