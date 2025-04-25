/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import de.eshg.base.address.AddressDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "Facility")
public record FacilityDto(
    @NotNull @Schema(description = "Name of the facility.", example = "Geschwister-Scholl-Schule")
        String name,
    @Valid @Schema(description = "Contact person in the facility.")
        List<FacilityContactPersonDto> contactPersons,
    @Schema(description = "Type of the facility.") @NotNull MPFacilityTypeDto type,
    @Schema(description = "Additional facility type if not listed.")
        String otherFacilityTypeInformation,
    String description,
    @Schema(description = "Phone number of the facility.", example = "+491234567890")
        String phoneNumber,
    @Schema(description = "Email address of the facility.", example = "example@mail.de") @Email
        String emailAddress,
    @Valid @NotNull AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress,
    @Valid FacilitySyncDto facilitySync)
    implements ValidOtherFacilityTypeInformation {

  public FacilityDto(
      @NotNull String name,
      @Valid List<FacilityContactPersonDto> contactPersons,
      @NotNull MPFacilityTypeDto facilityType,
      String otherFacilityTypeInformation,
      String phoneNumber,
      @Email String emailAddress,
      AddressDto contactAddress,
      AddressDto differentBillingAddress,
      @Valid FacilitySyncDto facilitySync) {
    this(
        name,
        contactPersons,
        facilityType,
        otherFacilityTypeInformation,
        null,
        phoneNumber,
        emailAddress,
        contactAddress,
        differentBillingAddress,
        facilitySync);
  }
}
