/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.persistence.entity;

import de.eshg.base.address.persistence.entity.DomesticAddress;
import de.eshg.base.util.CountryCode;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.envers.Audited;

@Entity
@Audited(withModifiedFlag = true)
public class DomesticContactAddress extends ContactAddress implements DomesticAddress {

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private String postalCode;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private String city;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private CountryCode country;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String differentName;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String street;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private String houseNumber;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String addressAddition;

  @Override
  public CountryCode getCountry() {
    return country;
  }

  @Override
  public void setCountry(CountryCode country) {
    this.country = country;
  }

  @Override
  public String getCity() {
    return city;
  }

  @Override
  public void setCity(String city) {
    this.city = city;
  }

  @Override
  public String getPostalCode() {
    return postalCode;
  }

  @Override
  public void setPostalCode(String postalCode) {
    this.postalCode = postalCode;
  }

  @Override
  public String getDifferentName() {
    return differentName;
  }

  @Override
  public void setDifferentName(String differentName) {
    this.differentName = differentName;
  }

  @Override
  public String getStreet() {
    return this.street;
  }

  @Override
  public void setStreet(String street) {
    this.street = street;
  }

  @Override
  public String getHouseNumber() {
    return this.houseNumber;
  }

  @Override
  public void setHouseNumber(String houseNumber) {
    this.houseNumber = houseNumber;
  }

  @Override
  public String getAddressAddition() {
    return this.addressAddition;
  }

  @Override
  public void setAddressAddition(String addressAddition) {
    this.addressAddition = addressAddition;
  }
}
