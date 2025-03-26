/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.xlsximport.util;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.lib.xlsximport.model.AddressData;

public final class AddressMapper {
  private AddressMapper() {}

  public static AddressDto mapToDto(AddressData address) {
    if (address == null) {
      return null;
    }

    return new DomesticAddressDto(
        address.country(),
        address.city(),
        address.postalCode(),
        null,
        address.street(),
        address.houseNumber(),
        address.addressAddition());
  }
}
