/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.address.persistence.entity;

public interface DomesticAddress extends Address {

  String getStreet();

  void setStreet(String street);

  String getHouseNumber();

  void setHouseNumber(String houseNumber);

  String getAddressAddition();

  void setAddressAddition(String addressAddition);
}
