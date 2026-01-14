/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.api;

import de.eshg.base.address.AddressDto;
import de.eshg.base.centralfile.api.facility.FacilityContactPersonDto;
import de.eshg.validation.constraints.MandatoryEmailAddressConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(name = "Facility")
public record FacilityDto(
    @NotNull long version,
    @NotNull String name,
    List<@MandatoryEmailAddressConstraint String> emailAddresses,
    List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Valid List<FacilityContactPersonDto> contactPersons,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress,
    @Valid FacilitySyncDto facilitySync) {}
