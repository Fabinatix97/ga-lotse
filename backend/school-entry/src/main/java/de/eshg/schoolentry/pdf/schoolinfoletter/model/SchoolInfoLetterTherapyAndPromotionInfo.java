/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

public record SchoolInfoLetterTherapyAndPromotionInfo(
    Boolean speechTherapy,
    Boolean ergoTherapy,
    Boolean physioTherapy,
    Boolean psychoMotorSkills,
    Boolean miscellaneous) {}
