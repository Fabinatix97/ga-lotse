/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import de.eshg.base.GenderDto;
import de.eshg.stiprotection.api.PersonalDetails;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.Year;

public record AddPersonalDetailsRequest(
    @NotNull GenderDto gender,
    @NotNull @Past Year yearOfBirth,
    @Schema(description = "Optional appointment booking information for resubmission on failure")
        @Valid
        BookAppointmentRequest appointmentBooking,
    @Schema(description = "Indicates whether the patient has sufficient German language skills.")
        Boolean hasSufficientGermanLanguageSkills,
    @Schema(
            description = "Other languages the patient can speak or understand.",
            example = "Spanish and French.")
        String otherKnownLanguages,
    @Schema(description = "Specifies the pronouns the person uses.", example = "she/her")
        String pronouns)
    implements PersonalDetails {}
