/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.base.GenderDto;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import java.time.Instant;
import java.time.Year;

public record CreateProcedureRequest(
    @NotNull ConcernDto concern,
    @NotNull GenderDto gender,
    @NotNull
        @Past
        @Schema(
            type = "integer",
            description = "Indicates the year of birth of the person.",
            example = "1996")
        Year yearOfBirth,
    CountryCode countryOfBirth,
    @Schema(
            type = "integer",
            description = "The year since the person has been residing in Germany.",
            example = "2022")
        @PastOrPresent
        Year inGermanySince,
    @NotNull AppointmentBookingTypeDto appointmentBookingType,
    @Schema(description = "The start date and time of the appointment.") @NotNull
        Instant appointmentStart,
    @Schema(description = "Duration of the appointment in minutes.", example = "30")
        @NotNull
        @Positive
        Integer durationInMinutes,
    @Schema(description = "Indicates whether the patient has sufficient German language skills.")
        Boolean hasSufficientGermanLanguageSkills,
    @Schema(
            description = "Other languages the patient can speak or understand.",
            example = "Spanish and French.")
        String otherKnownLanguages,
    @Schema(description = "Specifies the pronouns the person uses.", example = "she/her")
        String pronouns)
    implements PersonalDetails {}
