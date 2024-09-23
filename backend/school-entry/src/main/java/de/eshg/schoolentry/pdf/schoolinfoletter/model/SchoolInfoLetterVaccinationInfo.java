/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

public record SchoolInfoLetterVaccinationInfo(
    Boolean measlesProtectionComplete,
    Boolean vaccinationPassNotPresented,
    Boolean medicalContraindicationAgainstMeasles) {}
