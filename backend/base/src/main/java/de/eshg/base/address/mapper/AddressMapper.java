/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.address.mapper;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.address.persistence.entity.Address;
import de.eshg.base.address.persistence.entity.DomesticAddress;
import de.eshg.base.address.persistence.entity.PostboxAddress;
import de.eshg.base.centralfile.api.DiffDto;
import de.eshg.base.centralfile.persistence.entity.*;
import de.eshg.base.util.AbstractDiffer;
import java.util.List;
import org.apache.commons.lang3.builder.Diff;
import org.apache.commons.lang3.builder.DiffResult;

public final class AddressMapper {

  private AddressMapper() {}

  public static PostboxAddressDto mapPostboxAddressToApi(PostboxAddress address) {
    return new PostboxAddressDto(
        address.getCountry(),
        address.getCity(),
        address.getPostalCode(),
        address.getDifferentName(),
        address.getPostbox());
  }

  public static DomesticAddressDto mapDomesticAddressToApi(DomesticAddress address) {
    return new DomesticAddressDto(
        address.getCountry(),
        address.getCity(),
        address.getPostalCode(),
        address.getDifferentName(),
        address.getStreet(),
        address.getHouseNumber(),
        address.getAddressAddition());
  }

  public static <T extends PostboxAddress> T mapPostboxAddressIntoDm(
      PostboxAddressDto addressDto, T address) {
    setAddressDmFields(address, addressDto);
    address.setPostbox(addressDto.postbox());
    return address;
  }

  public static <T extends DomesticAddress> T mapDomesticAddressIntoDm(
      DomesticAddressDto addressDto, T address) {
    setAddressDmFields(address, addressDto);
    address.setStreet(addressDto.street());
    address.setHouseNumber(addressDto.houseNumber());
    address.setAddressAddition(addressDto.addressAddition());
    return address;
  }

  private static void setAddressDmFields(Address address, AddressDto addressDto) {
    address.setPostalCode(addressDto.postalCode());
    address.setCity(addressDto.city());
    address.setCountry(addressDto.country());
    address.setDifferentName(addressDto.differentName());
  }

  public static DiffDto<AddressDto> mapAddressDiffToApi(Address address, Address refAddress) {
    DiffResult<? extends Address> diff = AbstractDiffer.diff(address, refAddress);
    List<String> differingFields = diff.getDiffs().stream().map(Diff::getFieldName).toList();
    return new DiffDto<>(differingFields, mapAddressToApi(address), mapAddressToApi(refAddress));
  }

  public static AddressDto mapAddressToApi(Address address) {
    return switch (address) {
      case null -> null;
      case PostboxPersonAddress postboxPersonAddress ->
          mapPostboxAddressToApi(postboxPersonAddress);
      case DomesticPersonAddress domesticPersonAddress ->
          mapDomesticAddressToApi(domesticPersonAddress);
      case PostboxFacilityAddress postboxFacilityAddress ->
          mapPostboxAddressToApi(postboxFacilityAddress);
      case DomesticFacilityAddress domesticFacilityAddress ->
          mapDomesticAddressToApi(domesticFacilityAddress);
      default -> throw new RuntimeException("Unknown instance of Address");
    };
  }
}
