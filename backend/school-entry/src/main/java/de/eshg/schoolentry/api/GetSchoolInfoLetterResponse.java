/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterExaminationDto;
import jakarta.validation.Valid;

public record GetSchoolInfoLetterResponse(
    @Valid SchoolInfoLetterExaminationDto defaultValuesLetter,
    @Valid SchoolInfoLetterExaminationDto savedLetter) {}
