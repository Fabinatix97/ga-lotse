/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import de.eshg.base.GenderDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record ProphylaxisSessionChildExamination(
    @NotNull UUID childId,
    @NotNull String firstName,
    @NotNull String lastName,
    @NotNull LocalDate dateOfBirth,
    @NotNull String groupName,
    GenderDto gender,
    Boolean fluoridationConsent,
    @Valid ExaminationResultDto examinationResult) {}
