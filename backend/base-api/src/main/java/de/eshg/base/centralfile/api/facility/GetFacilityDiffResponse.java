/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.facility;

import de.eshg.base.address.AddressDto;
import de.eshg.base.centralfile.api.DiffDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetFacilityDiffResponse(
    @Schema(description = "The version of the reference facility") @NotNull @Min(0)
        Long referenceVersion,
    @Valid @NotNull DiffDto<FacilityDetailsDto> facilityDetailsDiff,
    @Valid @NotNull List<FacilityContactPersonDiffDto> contactPersonsDiff,
    @Valid @NotNull DiffDto<AddressDto> contactAddressDiff,
    @Valid @NotNull DiffDto<AddressDto> billingAddressDiff) {}
