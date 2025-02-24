/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.base.GenderDto;
import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import java.time.Instant;
import java.time.Year;

public record CreateProcedureRequest(
    @NotNull ConcernDto concern,
    @NotNull GenderDto gender,
    @NotNull @Past @Schema(type = "integer") Year yearOfBirth,
    CountryCode countryOfBirth,
    @Schema(
            type = "integer",
            description = "The year since the person has been residing in Germany.",
            example = "2022")
        @PastOrPresent
        Year inGermanySince,
    @NotNull AppointmentBookingTypeDto appointmentBookingType,
    @NotNull Instant appointmentStart,
    @NotNull @Positive Integer durationInMinutes)
    implements PersonalDetails {

  @AssertTrue(message = "The year of birth must be prior to the date of residence in Germany.")
  @JsonIgnore
  @SuppressWarnings("unused")
  public boolean isInGermanySinceValid() {
    if (inGermanySince == null) {
      return true;
    }
    return yearOfBirth.isBefore(inGermanySince);
  }
}
