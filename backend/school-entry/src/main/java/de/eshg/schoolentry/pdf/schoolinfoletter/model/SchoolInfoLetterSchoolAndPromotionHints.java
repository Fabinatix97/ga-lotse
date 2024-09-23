/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

public record SchoolInfoLetterSchoolAndPromotionHints(
    Boolean behavior,
    Boolean language,
    Boolean articulation,
    Boolean grammarAndVocabulary,
    Boolean auditiveInformationProcessing,
    Boolean visualPerception,
    Boolean colorsShapesNumbersSets,
    Boolean fineOrVisuoMotorSkills,
    Boolean grossMotorSkillsOrPhysicalCoordination,
    Boolean leftHandedness) {}
