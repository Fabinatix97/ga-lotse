/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

public record SchoolInfoLetterEyeExaminationInfo(
    Boolean conspicuous,
    Boolean clarificationArranged,
    Boolean spectacleWearer,
    Boolean underTreatment,
    Boolean colorSenseDisorder) {}
