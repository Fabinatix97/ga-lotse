/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.address.persistence.entity;

import de.eshg.lib.common.CountryCode;

public interface Address {

  Long getId();

  String getPostalCode();

  void setPostalCode(String postalCode);

  String getCity();

  void setCity(String city);

  CountryCode getCountry();

  void setCountry(CountryCode country);

  String getDifferentName();

  void setDifferentName(String differentName);
}
