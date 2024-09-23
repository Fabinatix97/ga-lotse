/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import de.eshg.base.address.AddressDto;
import de.eshg.base.centralfile.api.DataOriginDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

@Schema(name = "FacilityFileState")
public record AddFacilityFileStateResponse(
    @Schema(
            description = "The Id of the Facility.",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID id,
    @NotNull @Size(min = 1, max = 300) String name,
    @NotNull List<@NotNull @Size(min = 6, max = 254) String> emailAddresses,
    @NotNull List<@NotNull @Size(min = 1, max = 23) String> phoneNumbers,
    @Schema(
            description =
                "The version of referenceData that was present when the FileState was created. Can be increased if a newer version is irrelevant for the Procedure and the outdated flag shall be suppressed.",
            example = "1")
        @NotNull
        Long referenceVersion,
    @NotNull @Valid List<FacilityContactPersonDto> contactPersons,
    @Valid AddressDto contactAddress,
    @Valid AddressDto differentBillingAddress,
    @NotNull DataOriginDto dataOrigin)
    implements FacilityDetails {}
