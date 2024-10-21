/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.mapper;

import de.eshg.base.address.DomesticAddressDto;
import de.eshg.medicalregistry.api.AddressDto;

public final class AddressMapper {
  private AddressMapper() {}

  public static AddressDto mapToDto(de.eshg.base.address.AddressDto addressDto) {
    if (addressDto == null) {
      return null;
    }

    if (addressDto instanceof DomesticAddressDto address) {
      return mapToDto(address);
    } else {
      throw new IllegalArgumentException("Unexpected instance of Address");
    }
  }

  private static AddressDto mapToDto(DomesticAddressDto addressDto) {
    if (addressDto == null) {
      return null;
    }

    return new AddressDto(
        addressDto.street(), addressDto.houseNumber(), addressDto.postalCode(), addressDto.city());
  }
}
