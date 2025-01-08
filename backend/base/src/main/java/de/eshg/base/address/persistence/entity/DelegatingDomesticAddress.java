/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.address.persistence.entity;

import de.eshg.base.address.persistence.embeddable.EmbeddableDomesticAddress;

public interface DelegatingDomesticAddress
    extends DelegatingAddress<EmbeddableDomesticAddress>, DomesticAddress {

  @Override
  default String getStreet() {
    return getDelegate().getStreet();
  }

  @Override
  default void setStreet(String street) {
    getDelegate().setStreet(street);
  }

  @Override
  default String getHouseNumber() {
    return getDelegate().getHouseNumber();
  }

  @Override
  default void setHouseNumber(String houseNumber) {
    getDelegate().setHouseNumber(houseNumber);
  }

  @Override
  default String getAddressAddition() {
    return getDelegate().getAddressAddition();
  }

  @Override
  default void setAddressAddition(String addressAddition) {
    getDelegate().setAddressAddition(addressAddition);
  }
}
