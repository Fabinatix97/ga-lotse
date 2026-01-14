/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr;

import de.eshg.base.address.DomesticAddressDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FacilityIdentificationDataForValidation(
    @NotNull String dataTransmitterPseudonymId,
    @NotBlank String facilityName,
    @NotNull @Valid DomesticAddressDto addressDto)
    implements IdentificationDataForValidation {}
