/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import de.eshg.base.address.AddressDto;
import de.eshg.base.centralfile.api.facility.FacilityContactPersonDto;
import de.eshg.base.centralfile.api.facility.FacilityDetails;
import de.eshg.validation.constraints.MandatoryEmailAddressConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

@Schema(name = "PracticeReferenceFacility")
public record PracticeReferenceFacilityDto(
    @NotNull UUID id,
    @NotNull long version,
    @NotNull @Size(min = 1, max = 300) String name,
    List<@MandatoryEmailAddressConstraint String> emailAddresses,
    List<@NotNull @Size(max = 23) String> phoneNumbers,
    @Valid List<FacilityContactPersonDto> contactPersons,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress)
    implements FacilityDetails {}
