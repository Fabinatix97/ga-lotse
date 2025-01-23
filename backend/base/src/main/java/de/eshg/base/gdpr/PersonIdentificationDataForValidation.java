/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import de.eshg.base.SalutationDto;
import de.eshg.base.address.DomesticAddressDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PersonIdentificationDataForValidation(
    @NotNull String bpk2,
    @NotBlank String firstName,
    @NotBlank String lastName,
    @NotBlank String birthDate,
    String nameAtBirth,
    @NotBlank String placeOfBirth,
    String emailAddress,
    String phoneNumber,
    String title,
    SalutationDto salutationDto,
    @NotNull @Valid DomesticAddressDto addressDto)
    implements IdentificationDataForValidation {}
