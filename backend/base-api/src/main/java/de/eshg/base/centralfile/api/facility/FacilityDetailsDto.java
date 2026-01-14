/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import de.eshg.base.address.AddressDto;
import de.eshg.validation.constraints.MandatoryEmailAddressConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(name = FacilityDetailsDto.SCHEMA_NAME, description = "The data relating to a facility")
public record FacilityDetailsDto(
    @NotNull @Size(min = 1, max = MAX_NAME_LENGTH) String name,
    List<@MandatoryEmailAddressConstraint String> emailAddresses,
    List<@NotNull @Size(max = 23) String> phoneNumbers,
    @Valid List<FacilityContactPersonDto> contactPersons,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress)
    implements FacilityDetails {

  public static final int MAX_NAME_LENGTH = 300;
  public static final String SCHEMA_NAME = "FacilityDetails";

  public FacilityDetailsDto(FacilityDetails facilityDetails) {
    this(
        facilityDetails.name(),
        facilityDetails.emailAddresses(),
        facilityDetails.phoneNumbers(),
        facilityDetails.contactPersons(),
        facilityDetails.contactAddress(),
        facilityDetails.differentBillingAddress());
  }
}
