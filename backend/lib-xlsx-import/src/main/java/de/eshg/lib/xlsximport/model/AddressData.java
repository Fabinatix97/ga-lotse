/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport.model;

import de.eshg.lib.common.CountryCode;

public record AddressData(
    CountryCode country,
    String city,
    String postalCode,
    String street,
    String houseNumber,
    String addressAddition) {}
