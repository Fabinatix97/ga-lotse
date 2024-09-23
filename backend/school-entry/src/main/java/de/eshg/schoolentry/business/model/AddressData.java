/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.base.CountryCodeDto;

public record AddressData(
    CountryCodeDto country,
    String city,
    String postalCode,
    String street,
    String houseNumber,
    String addressAddition) {}
