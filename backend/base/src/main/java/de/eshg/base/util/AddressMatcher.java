/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import de.eshg.base.address.persistence.entity.Address;
import de.eshg.base.address.persistence.entity.DomesticAddress;
import de.eshg.base.address.persistence.entity.PostboxAddress;
import org.apache.commons.lang3.StringUtils;

public class AddressMatcher {

  private AddressMatcher() {}

  public static boolean isAddressMatch(Address referenceAddress, Address addressFileState) {
    return switch (referenceAddress) {
      case null -> addressFileState == null;
      case DomesticAddress domesticAddress ->
          isDomesticAddressMatch(domesticAddress, addressFileState);
      case PostboxAddress postboxAddress -> isPostboxAddressMatch(postboxAddress, addressFileState);
      default -> throw new IllegalArgumentException("Unsupported instance of Address");
    };
  }

  private static boolean isCommonAttributesMatch(
      Address referenceAddress, Address addressFileState) {
    return referenceAddress.getCountry() == addressFileState.getCountry()
        && StringUtils.equals(referenceAddress.getCity(), addressFileState.getCity())
        && StringUtils.equals(referenceAddress.getPostalCode(), addressFileState.getPostalCode())
        && StringUtils.equals(
            referenceAddress.getDifferentName(), addressFileState.getDifferentName());
  }

  private static boolean isDomesticAddressMatch(
      DomesticAddress domesticAddress, Address addressFileState) {
    return addressFileState instanceof DomesticAddress domesticAddressFileState
        && isCommonAttributesMatch(domesticAddress, domesticAddressFileState)
        && StringUtils.equals(domesticAddress.getStreet(), domesticAddressFileState.getStreet())
        && StringUtils.equals(
            domesticAddress.getHouseNumber(), domesticAddressFileState.getHouseNumber())
        && StringUtils.equals(
            domesticAddress.getAddressAddition(), domesticAddressFileState.getAddressAddition());
  }

  private static boolean isPostboxAddressMatch(
      PostboxAddress postboxAddress, Address addressFileState) {
    return addressFileState instanceof PostboxAddress postboxAddressFileState
        && isCommonAttributesMatch(postboxAddress, postboxAddressFileState)
        && StringUtils.equals(postboxAddress.getPostbox(), postboxAddressFileState.getPostbox());
  }
}
