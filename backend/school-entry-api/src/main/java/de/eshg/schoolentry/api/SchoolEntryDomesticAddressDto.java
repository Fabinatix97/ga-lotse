/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = SchoolEntryDomesticAddressDto.SCHEMA_NAME, description = "A usual domestic address.")
public record SchoolEntryDomesticAddressDto(
    @NotNull CountryCode country,
    @Schema(description = "The city in which the address is located.", example = "Berlin")
        @NotNull
        @Size(min = 1, max = MAX_CITY_LENGTH)
        String city,
    @Schema(description = "The postal code of the address.", example = "10115")
        @NotNull
        @Size(min = 1, max = MAX_POSTAL_CODE_LENGTH)
        String postalCode,
    @Schema(
            description =
                "If the name of the addressee deviates from the present name of a Person or Facility, e.g. when a company pays the bill for its employee or a parent company shall be contacted instead of its subsidiary.",
            example = "Parent Company AG")
        @Size(min = 1, max = 200)
        String differentName,
    @Schema(
            description = "The name of the street of the address, without the house number.",
            example = "Beispielweg")
        @NotNull
        @Size(min = 1, max = MAX_STREET_LENGTH)
        String street,
    @Schema(description = "The house number of the address, including extensions.", example = "1a")
        @Size(min = 1, max = MAX_HOUSE_NUMBER_LENGTH)
        String houseNumber,
    @Schema(description = "A descriptive addition to the address.", example = "2.OG links")
        @Size(min = 1, max = 100)
        String addressAddition)
    implements SchoolEntryAddressDto {

  public static final String SCHEMA_NAME = "SchoolEntryDomesticAddress";
  public static final int MAX_CITY_LENGTH = 50;
  public static final int MAX_POSTAL_CODE_LENGTH = 20;
  public static final int MAX_STREET_LENGTH = 55;
  public static final int MAX_HOUSE_NUMBER_LENGTH = 11;

  @Override
  public String type() {
    return SCHEMA_NAME;
  }

  public SchoolEntryDomesticAddressDto(
      CountryCode country, String city, String postalCode, String street) {
    this(country, city, postalCode, null, street, null, null);
  }

  public SchoolEntryDomesticAddressDto(
      CountryCode country, String city, String postalCode, String street, String houseNumber) {
    this(country, city, postalCode, null, street, houseNumber, null);
  }
}
