/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import de.eshg.schoolentry.api.schoolinfoletter.SchoolInfoLetterExaminationDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record GetSchoolInfoLetterResponse(
    @NotNull @Valid SchoolInfoLetterExaminationDto defaultValuesLetter,
    @Valid SchoolInfoLetterExaminationDto savedLetter) {}
