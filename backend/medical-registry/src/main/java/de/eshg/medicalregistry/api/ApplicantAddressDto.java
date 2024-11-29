/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import de.eshg.lib.common.CountryCode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(name = "ApplicantAddress")
public class ApplicantAddressDto {

  @NotNull private CountryCode country;

  @NotNull
  @Size(min = 1, max = 55)
  private String street;

  @NotNull
  @Size(min = 1, max = 11)
  private String houseNumber;

  @NotNull
  @Size(min = 1, max = 20)
  private String postalCode;

  @NotNull
  @Size(min = 1, max = 50)
  private String city;

  public ApplicantAddressDto() {}

  public ApplicantAddressDto(
      CountryCode country, String street, String houseNumber, String postalCode, String city) {
    this.country = country;
    this.street = street;
    this.houseNumber = houseNumber;
    this.postalCode = postalCode;
    this.city = city;
  }

  public CountryCode getCountry() {
    return country;
  }

  public void setCountry(CountryCode country) {
    this.country = country;
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
}
