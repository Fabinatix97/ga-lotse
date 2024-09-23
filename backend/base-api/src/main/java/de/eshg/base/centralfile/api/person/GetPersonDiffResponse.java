/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import de.eshg.base.address.AddressDto;
import de.eshg.base.centralfile.api.DiffDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record GetPersonDiffResponse(
    @Schema(description = "The version of the reference person") @NotNull @Min(0)
        long referenceVersion,
    @Valid @NotNull DiffDto<PersonDetailsDto> personDetailsDiff,
    @Valid @NotNull DiffDto<AddressDto> contactAddressDiff,
    @Valid @NotNull DiffDto<AddressDto> billingAddressDiff) {}
