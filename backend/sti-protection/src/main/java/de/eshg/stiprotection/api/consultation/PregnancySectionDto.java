/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.consultation;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;

@Schema(name = "ConsultationPregnancySection")
public record PregnancySectionDto(
    Boolean hasPregnancyRelatedInfo,
    @PastOrPresent() LocalDate lastCytologyTest,
    @PastOrPresent() LocalDate startOfLastPeriod,
    @PositiveOrZero() Integer numberOfPregnancies,
    @PositiveOrZero() Integer numberOfInducedAbortions,
    @PositiveOrZero() Integer numberOfBirths,
    @PositiveOrZero() Integer numberOfOtherAbortions,
    @PositiveOrZero() Integer numberOfEctopicPregnancies) {}
