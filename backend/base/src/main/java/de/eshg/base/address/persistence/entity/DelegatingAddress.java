/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.address.persistence.entity;

import de.eshg.base.address.persistence.embeddable.EmbeddableAddress;
import de.eshg.lib.common.CountryCode;

public interface DelegatingAddress<E extends EmbeddableAddress> extends Address {

  Long getId();

  E getDelegate();

  default String getPostalCode() {
    return getDelegate().getPostalCode();
  }

  default void setPostalCode(String postalCode) {
    getDelegate().setPostalCode(postalCode);
  }

  default String getCity() {
    return getDelegate().getCity();
  }

  default void setCity(String city) {
    getDelegate().setCity(city);
  }

  default CountryCode getCountry() {
    return getDelegate().getCountry();
  }

  default void setCountry(CountryCode country) {
    getDelegate().setCountry(country);
  }

  default String getDifferentName() {
    return getDelegate().getDifferentName();
  }

  default void setDifferentName(String differentName) {
    getDelegate().setDifferentName(differentName);
  }
}
