/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "SchoolInfoLetterSchoolAndPromotionHints")
public record SchoolInfoLetterSchoolAndPromotionHintsDto(
    @NotNull boolean behavior,
    @NotNull boolean language,
    @NotNull boolean articulation,
    @NotNull boolean grammarAndVocabulary,
    @NotNull boolean auditiveInformationProcessing,
    @NotNull boolean visualPerception,
    @NotNull boolean colorsShapesNumbersSets,
    @NotNull boolean fineOrVisuoMotorSkills,
    @NotNull boolean grossMotorSkillsOrPhysicalCoordination,
    @NotNull boolean leftHandedness) {}
