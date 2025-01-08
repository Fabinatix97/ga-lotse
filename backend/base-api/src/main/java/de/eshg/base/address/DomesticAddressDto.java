/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.address;

import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = DomesticAddressDto.SCHEMA_NAME, description = "A usual domestic address.")
public record DomesticAddressDto(
    @NotNull CountryCode country,
    @Schema(description = "The city in which the address is located.", example = "Berlin")
        @NotNull
        @Size(min = 1, max = 50)
        String city,
    @Schema(description = "The postal code of the address.", example = "10115")
        @NotNull
        @Size(min = 1, max = 20)
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
        @Size(min = 1, max = 55)
        String street,
    @Schema(description = "The house number of the address, including extensions.", example = "1a")
        @Size(min = 1, max = 11)
        String houseNumber,
    @Schema(description = "A descriptive addition to the address.", example = "2.OG links")
        @Size(min = 1, max = 100)
        String addressAddition)
    implements AddressDto {

  public static final String SCHEMA_NAME = "DomesticAddress";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }

  public DomesticAddressDto(CountryCode country, String city, String postalCode, String street) {
    this(country, city, postalCode, null, street, null, null);
  }

  public DomesticAddressDto(
      CountryCode country, String city, String postalCode, String street, String houseNumber) {
    this(country, city, postalCode, null, street, houseNumber, null);
  }
}
