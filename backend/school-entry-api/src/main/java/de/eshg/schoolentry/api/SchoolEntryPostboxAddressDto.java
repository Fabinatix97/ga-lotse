/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(
    name = SchoolEntryPostboxAddressDto.SCHEMA_NAME,
    description = "An address which is a postbox.")
public record SchoolEntryPostboxAddressDto(
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
    @Schema(description = "The number (or name) of the postbox.", example = "123")
        @NotNull
        @Size(min = 1, max = 21)
        String postbox)
    implements SchoolEntryAddressDto {

  public static final String SCHEMA_NAME = "SchoolEntryPostboxAddress";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }

  public SchoolEntryPostboxAddressDto(
      CountryCode country, String city, String postalCode, String postbox) {
    this(country, city, postalCode, null, postbox);
  }
}
