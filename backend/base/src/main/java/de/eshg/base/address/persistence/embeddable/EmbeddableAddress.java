/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.address.persistence.embeddable;

import de.eshg.lib.common.CountryCode;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@MappedSuperclass
public abstract class EmbeddableAddress {

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

  public CountryCode getCountry() {
    return country;
  }

  public void setCountry(CountryCode country) {
    this.country = country;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getPostalCode() {
    return postalCode;
  }

  public void setPostalCode(String postalCode) {
    this.postalCode = postalCode;
  }

  public String getDifferentName() {
    return differentName;
  }

  public void setDifferentName(String differentName) {
    this.differentName = differentName;
  }
}
