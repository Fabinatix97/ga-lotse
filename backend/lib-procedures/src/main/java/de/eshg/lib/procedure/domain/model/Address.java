/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;

@Entity
public class Address extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column
  private Integer postboxNumber;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column
  private String street;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column
  private String houseNumber;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column
  private String addressAddition;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column
  private String postalCode;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column
  private String city;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column
  private String country;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(optional = false)
  private ContactDetails contactDetails;

  public Integer getPostboxNumber() {
    return postboxNumber;
  }

  public void setPostboxNumber(Integer postboxNumber) {
    this.postboxNumber = postboxNumber;
  }

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

  public String getPostalCode() {
    return postalCode;
  }

  public void setPostalCode(String postalCode) {
    this.postalCode = postalCode;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getCountry() {
    return country;
  }

  public void setCountry(String country) {
    this.country = country;
  }

  public ContactDetails getContactDetails() {
    return contactDetails;
  }

  public void setContactDetails(ContactDetails contactDetails) {
    this.contactDetails = contactDetails;
  }
}
