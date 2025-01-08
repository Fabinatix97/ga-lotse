/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import de.eshg.lib.common.CountryCode;

public sealed interface FacilityAddressPartialMatchAttributes
    permits DomesticFacilityAddressPartialMatchAttributes,
        PostboxFacilityAddressPartialMatchAttributes {

  CountryCode country();

  String city();

  String postalCode();
}
