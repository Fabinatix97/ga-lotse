/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.mapper;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.lib.common.CountryCode;
import de.eshg.medicalregistry.api.ApplicantAddressDto;
import de.eshg.medicalregistry.api.PracticeAddressDto;

public final class AddressMapper {
  private AddressMapper() {}

  public static ApplicantAddressDto mapToApplicantAddressDto(AddressDto addressDto) {
    if (addressDto == null) {
      return null;
    }

    DomesticAddressDto address = toDomesticAddressOrThrow(addressDto);
    return new ApplicantAddressDto(
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

  public static DomesticAddressDto mapAddress(ApplicantAddressDto address) {
    return new DomesticAddressDto(
        address.getCountry(),
        address.getCity(),
        address.getPostalCode(),
        null,
        address.getStreet(),
        address.getHouseNumber(),
        null);
  }

  public static DomesticAddressDto mapAddress(PracticeAddressDto address) {
    return new DomesticAddressDto(
        CountryCode.DE,
        address.getCity(),
        address.getPostalCode(),
        null,
        address.getStreet(),
        address.getHouseNumber(),
        null);
  }
}
