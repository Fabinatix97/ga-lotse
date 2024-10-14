/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

public record SchoolInfoLetterVaccinationInfo(
    boolean measlesProtectionComplete,
    boolean vaccinationPassNotPresented,
    boolean measlesContraIndication,
    boolean measlesContraIndicationPermanent,
    String measlesContraIndicationUntil) {}
