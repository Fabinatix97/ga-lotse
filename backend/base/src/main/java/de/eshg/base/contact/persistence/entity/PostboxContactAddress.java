/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.persistence.entity;

import de.eshg.base.address.persistence.entity.PostboxAddress;
import de.eshg.lib.common.CountryCode;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.envers.Audited;

@Entity
@Audited(withModifiedFlag = true)
public class PostboxContactAddress extends ContactAddress implements PostboxAddress {

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

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private String postbox;

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
  public String getPostbox() {
    return postbox;
  }

  @Override
  public void setPostbox(String postbox) {
    this.postbox = postbox;
  }
}
