/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(name = DepartmentConfiguration.TABLE_NAME)
public class DepartmentConfiguration extends BaseEntity {

  public static final String TABLE_NAME = "department_configuration";

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private String name;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private String abbreviation;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private String street;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private String houseNumber;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private String postalCode;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private String city;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private CountryCode country;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private String phoneNumber;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private String homepage;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private String email;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private double latitude;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private double longitude;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private byte[] logo;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private byte[] securityTxt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private byte[] securityTxtPublicKey;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private byte[] streetDirectory;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private byte[] municipalityDirectory;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getAbbreviation() {
    return abbreviation;
  }

  public void setAbbreviation(String abbreviation) {
    this.abbreviation = abbreviation;
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

  public CountryCode getCountry() {
    return country;
  }

  public void setCountry(CountryCode country) {
    this.country = country;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getHomepage() {
    return homepage;
  }

  public void setHomepage(String homepage) {
    this.homepage = homepage;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Double getLatitude() {
    return latitude;
  }

  public void setLatitude(Double latitude) {
    this.latitude = latitude;
  }

  public Double getLongitude() {
    return longitude;
  }

  public void setLongitude(Double longitude) {
    this.longitude = longitude;
  }

  public byte[] getLogo() {
    return logo;
  }

  public void setLogo(byte[] logo) {
    this.logo = logo;
  }

  public byte[] getSecurityTxt() {
    return securityTxt;
  }

  public void setSecurityTxt(byte[] securityTxt) {
    this.securityTxt = securityTxt;
  }

  public byte[] getSecurityTxtPublicKey() {
    return securityTxtPublicKey;
  }

  public void setSecurityTxtPublicKey(byte[] securityTxtPublicKey) {
    this.securityTxtPublicKey = securityTxtPublicKey;
  }

  public byte[] getStreetDirectory() {
    return streetDirectory;
  }

  public void setStreetDirectory(byte[] streetDirectory) {
    this.streetDirectory = streetDirectory;
  }

  public byte[] getMunicipalityDirectory() {
    return municipalityDirectory;
  }

  public void setMunicipalityDirectory(byte[] municipalityDirectory) {
    this.municipalityDirectory = municipalityDirectory;
  }
}
