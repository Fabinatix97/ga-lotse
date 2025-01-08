/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import de.eshg.lib.common.CountryCode;
import jakarta.validation.constraints.NotNull;

public record DomesticFacilityAddressPartialMatchAttributes(
    @NotNull CountryCode country,
    @NotNull String city,
    @NotNull String postalCode,
    @NotNull String street,
    @NotNull String houseNumber)
    implements FacilityAddressPartialMatchAttributes {}
