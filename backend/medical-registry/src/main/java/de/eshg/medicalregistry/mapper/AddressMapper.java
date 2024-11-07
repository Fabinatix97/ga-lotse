/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.mapper;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.medicalregistry.api.PracticeAddressDto;
import de.eshg.medicalregistry.api.ProfessionalAddressDto;

public final class AddressMapper {
  private AddressMapper() {}

  public static ProfessionalAddressDto mapToProfessionalAddressDto(AddressDto addressDto) {
    if (addressDto == null) {
      return null;
    }

    DomesticAddressDto address = toDomesticAddressOrThrow(addressDto);
    return new ProfessionalAddressDto(
        address.country(),
        address.street(),
        address.houseNumber(),
        address.postalCode(),
        address.city());
  }

  public static PracticeAddressDto mapToPracticeAddressDto(AddressDto addressDto) {
    if (addressDto == null) {
      return null;
    }

    DomesticAddressDto address = toDomesticAddressOrThrow(addressDto);
    return new PracticeAddressDto(
        address.street(), address.houseNumber(), address.postalCode(), address.city());
  }

  private static DomesticAddressDto toDomesticAddressOrThrow(AddressDto addressDto) {
    if (addressDto instanceof DomesticAddressDto address) {
      return address;
    } else {
      throw new IllegalArgumentException("Unexpected instance of Address");
    }
  }
}
