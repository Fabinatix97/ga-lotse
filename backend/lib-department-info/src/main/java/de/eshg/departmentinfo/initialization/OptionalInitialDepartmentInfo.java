/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo.initialization;

import de.eshg.lib.common.CountryCode;

public class OptionalInitialDepartmentInfo implements InitialDepartmentInfo {

  private boolean useDepartmentInfoFromBaseModule = true;
  private String name;
  private String abbreviation;
  private String street;
  private String houseNumber;
  private String postalCode;
  private String city;
  private CountryCode country;
  private String phoneNumber;
  private String homepage;
  private String email;
  private Double latitude;
  private Double longitude;

  public boolean useDepartmentInfoFromBaseModule() {
    return useDepartmentInfoFromBaseModule;
  }

  @Override
  public String name() {
    return name;
  }

  @Override
  public String abbreviation() {
    return abbreviation;
  }

  @Override
  public String street() {
    return street;
  }

  @Override
  public String houseNumber() {
    return houseNumber;
  }

  @Override
  public String postalCode() {
    return postalCode;
  }

  @Override
  public String city() {
    return city;
  }

  @Override
  public CountryCode country() {
    return country;
  }

  @Override
  public String phoneNumber() {
    return phoneNumber;
  }

  @Override
  public String homepage() {
    return homepage;
  }

  @Override
  public String email() {
    return email;
  }

  @Override
  public Double latitude() {
    return latitude;
  }

  @Override
  public Double longitude() {
    return longitude;
  }

  public void setUseDepartmentInfoFromBaseModule(boolean useDepartmentInfoFromBaseModule) {
    this.useDepartmentInfoFromBaseModule = useDepartmentInfoFromBaseModule;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setAbbreviation(String abbreviation) {
    this.abbreviation = abbreviation;
  }

  public void setStreet(String street) {
    this.street = street;
  }

  public void setHouseNumber(String houseNumber) {
    this.houseNumber = houseNumber;
  }

  public void setPostalCode(String postalCode) {
    this.postalCode = postalCode;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public void setCountry(CountryCode country) {
    this.country = country;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public void setHomepage(String homepage) {
    this.homepage = homepage;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setLatitude(Double latitude) {
    this.latitude = latitude;
  }

  public void setLongitude(Double longitude) {
    this.longitude = longitude;
  }
}
