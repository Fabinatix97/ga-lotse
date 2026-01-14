/*
 * Copyright 2026 cronn GmbH
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
        @Size(min = 1, max = MAX_TITLE_LENGTH)
        String title,
    @Schema(description = "The given name(s) of the Person.", example = "John")
        @NotNull
        @Size(min = 1, max = MAX_FIRST_NAME_LENGTH)
        String firstName,
    @Schema(description = "The last name of the Person.", example = "Doe")
        @NotNull
        @Size(min = 1, max = MAX_LAST_NAME_LENGTH)
        String lastName,
    @Schema(description = "The date of birth of the Person.", example = "2000-01-01") @NotNull
        LocalDate dateOfBirth,
    @NotNull @Valid AddressDto address,
    @Schema(description = "The email addresses of the Person.", example = "mail@address.de")
        @Size(min = 6, max = 254)
        String emailAddress,
    @Schema(description = "The phone number of the Person.", example = "+491234567890")
        @Size(max = MAX_PHONE_NUMBER_LENGTH)
        String phoneNumber,
    @Schema(
            description = "The bpk2 of the BundId user",
            example = "VnMEBMXsiCWZ34v1JCulQABe6-ts1yDSrbH3zII8BF0")
        String bpk2)
    implements GdprIdentificationDataDto {

  public static final String SCHEMA_NAME = "GdprPerson";
  public static final int MAX_TITLE_LENGTH = 119;
  public static final int MAX_FIRST_NAME_LENGTH = 80;
  public static final int MAX_LAST_NAME_LENGTH = 120;
  public static final int MAX_PHONE_NUMBER_LENGTH = 23;

  @Override
  public String type() {
    return SCHEMA_NAME;
  }

  public GdprPersonDto(String firstName, String lastName, LocalDate birthDate, AddressDto address) {
    this(null, null, firstName, lastName, birthDate, address, null, null, null);
  }
}
