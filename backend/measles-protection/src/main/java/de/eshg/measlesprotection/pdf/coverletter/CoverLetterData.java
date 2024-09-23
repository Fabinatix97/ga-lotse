/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.pdf.coverletter;

public record CoverLetterData(
    CoverLetterType coverLetterType,
    CoverLetterPerson addressee,
    CoverLetterPerson affectedPerson,
    CoverLetterBody body) {}
