/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.schoolentry.api.SchoolEntryAddressDto;
import de.eshg.schoolentry.api.SchoolEntryDomesticAddressDto;
import de.eshg.schoolentry.api.SchoolEntryPostboxAddressDto;

public class AddressMapper {

  private AddressMapper() {}

  public static SchoolEntryAddressDto mapToSchoolEntryAddressDto(AddressDto address) {
    return address == null
        ? null
        : switch (address) {
          case DomesticAddressDto domesticAddress ->
              mapToSchoolEntryDomesticAddressDto(domesticAddress);
          case PostboxAddressDto postboxAddress ->
              mapToSchoolEntryPostboxAddressDto(postboxAddress);
        };
  }

  public static SchoolEntryDomesticAddressDto mapToSchoolEntryDomesticAddressDto(
      DomesticAddressDto address) {
    return address == null
        ? null
        : new SchoolEntryDomesticAddressDto(
            address.country(),
            address.city(),
            address.postalCode(),
            address.differentName(),
            address.street(),
            address.houseNumber(),
            address.addressAddition());
  }

  public static SchoolEntryPostboxAddressDto mapToSchoolEntryPostboxAddressDto(
      PostboxAddressDto address) {
    return address == null
        ? null
        : new SchoolEntryPostboxAddressDto(
            address.country(),
            address.city(),
            address.postalCode(),
            address.differentName(),
            address.postbox());
  }

  public static AddressDto mapToBaseAddressDto(SchoolEntryAddressDto address) {
    return address == null
        ? null
        : switch (address) {
          case SchoolEntryDomesticAddressDto domesticAddress ->
              mapToBaseDomesticAddressDto(domesticAddress);
          case SchoolEntryPostboxAddressDto postboxAddress ->
              mapToBasePostboxAddressDto(postboxAddress);
        };
  }

  public static DomesticAddressDto mapToBaseDomesticAddressDto(
      SchoolEntryDomesticAddressDto address) {
    return address == null
        ? null
        : new DomesticAddressDto(
            address.country(),
            address.city(),
            address.postalCode(),
            address.differentName(),
            address.street(),
            address.houseNumber(),
            address.addressAddition());
  }

  public static PostboxAddressDto mapToBasePostboxAddressDto(SchoolEntryPostboxAddressDto address) {
    return address == null
        ? null
        : new PostboxAddressDto(
            address.country(),
            address.city(),
            address.postalCode(),
            address.differentName(),
            address.postbox());
  }
}
