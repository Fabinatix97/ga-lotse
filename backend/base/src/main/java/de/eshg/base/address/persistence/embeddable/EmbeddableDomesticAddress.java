/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.address.persistence.embeddable;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class EmbeddableDomesticAddress extends EmbeddableAddress {

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String street;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private String houseNumber;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String addressAddition;

  public String getStreet() {
    return street;
  }

  public void setStreet(String street) {
    this.street = street;
  }

  public String getHouseNumber() {
    return houseNumber;
  }

  public void setHouseNumber(String houseNumber) {
    this.houseNumber = houseNumber;
  }

  public String getAddressAddition() {
    return addressAddition;
  }

  public void setAddressAddition(String addressAddition) {
    this.addressAddition = addressAddition;
  }
}
