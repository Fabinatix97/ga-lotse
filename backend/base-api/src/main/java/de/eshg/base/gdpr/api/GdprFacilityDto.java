/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import de.eshg.base.address.AddressDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = GdprFacilityDto.SCHEMA_NAME)
public record GdprFacilityDto(
    @Schema(description = "The name of the Facility.", example = "123 Example Facility")
        @NotNull
        @Size(min = 1, max = 300)
        String name,
    @NotNull @Valid AddressDto address,
    @Schema(description = "The email addresses of the Facility.", example = "mail@address.de")
        @Size(min = 6, max = 254)
        String emailAddress,
    @Schema(description = "The phone number of the Facility.", example = "+491234567890")
        @Size(min = 1, max = 23)
        String phoneNumber)
    implements GdprIdentificationDataDto {
  public static final String SCHEMA_NAME = "GdprFacility";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }

  public GdprFacilityDto(String name, AddressDto address) {
    this(name, address, null, null);
  }
}
