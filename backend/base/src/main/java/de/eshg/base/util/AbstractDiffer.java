/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.util;

import de.eshg.base.address.persistence.entity.Address;
import de.eshg.base.address.persistence.entity.DelegatingDomesticAddress;
import de.eshg.base.address.persistence.entity.PostboxAddress;
import de.eshg.base.centralfile.persistence.entity.*;
import org.apache.commons.lang3.builder.DiffBuilder;
import org.apache.commons.lang3.builder.DiffResult;
import org.apache.commons.lang3.builder.ToStringStyle;

public abstract class AbstractDiffer {

  public static DiffResult<? extends Address> diff(Address lhs, Address rhs) {
    Address left = lhs != null ? lhs : new DomesticFacilityAddress();
    Address right = rhs != null ? rhs : new DomesticFacilityAddress();
    DiffBuilder<Address> diffBuilder =
        new DiffBuilder<>(left, right, ToStringStyle.SHORT_PREFIX_STYLE)
            .append("country", left.getCountry(), right.getCountry())
            .append("city", trim(left.getCity()), trim(right.getCity()))
            .append("postalCode", trim(left.getPostalCode()), trim(right.getPostalCode()))
            .append("differentName", trim(left.getDifferentName()), trim(right.getDifferentName()));
    DelegatingDomesticAddress leftDomestic = getDomesticAddress(left);
    DelegatingDomesticAddress rightDomestic = getDomesticAddress(right);
    diffBuilder
        .append("street", trim(leftDomestic.getStreet()), trim(rightDomestic.getStreet()))
        .append(
            "houseNumber",
            trim(leftDomestic.getHouseNumber()),
            trim(rightDomestic.getHouseNumber()))
        .append(
            "addressAddition",
            trim(leftDomestic.getAddressAddition()),
            trim(rightDomestic.getAddressAddition()));
    PostboxAddress leftPostBox = getPostboxAddress(left);
    PostboxAddress rightPostBox = getPostboxAddress(right);
    diffBuilder.append("postBox", trim(leftPostBox.getPostbox()), trim(rightPostBox.getPostbox()));

    Class<? extends Address> leftClass = lhs == null ? null : lhs.getClass();
    Class<? extends Address> rightClass = rhs == null ? null : rhs.getClass();
    diffBuilder.append("@type", leftClass, rightClass);
    return diffBuilder.build();
  }

  private static DelegatingDomesticAddress getDomesticAddress(Address address) {
    return address instanceof DelegatingDomesticAddress domesticAddress
        ? domesticAddress
        : new DomesticFacilityAddress();
  }

  private static PostboxAddress getPostboxAddress(Address address) {
    return address instanceof PostboxAddress postBoxAddress
        ? postBoxAddress
        : new PostboxFacilityAddress();
  }

  protected static String trim(String s) {
    if (s == null) {
      return null;
    }
    return s.trim();
  }
}
