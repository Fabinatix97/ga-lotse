/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Schema(name = GdprPersonDto.SCHEMA_NAME)
public record GdprPersonDto(
    SalutationDto salutation,
    @Schema(description = "The academic title of the Person.", example = "Prof. Dr.")
        @Size(min = 1, max = 119)
        String title,
    @Schema(description = "The given name(s) of the Person.", example = "John")
        @NotNull
        @Size(min = 1, max = 80)
        String firstName,
    @Schema(description = "The last name of the Person.", example = "Doe")
        @NotNull
        @Size(min = 1, max = 120)
        String lastName,
    @Schema(description = "The date of birth of the Person.", example = "2000-01-01") @NotNull
        LocalDate dateOfBirth,
    @NotNull @Valid AddressDto address,
    @Schema(description = "The email addresses of the Person.", example = "mail@address.de")
        @Size(min = 6, max = 254)
        String emailAddress,
    @Schema(description = "The phone number of the Person.", example = "+491234567890")
        @Size(max = 23)
        String phoneNumber)
    implements GdprIdentificationDataDto {

  public static final String SCHEMA_NAME = "GdprPerson";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }

  public GdprPersonDto(String firstName, String lastName, LocalDate birthDate, AddressDto address) {
    this(null, null, firstName, lastName, birthDate, address, null, null);
  }
}
