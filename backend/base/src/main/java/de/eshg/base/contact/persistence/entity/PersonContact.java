/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.persistence.entity;

import de.eshg.base.util.Gender;
import de.eshg.base.util.Salutation;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.envers.Audited;

@Entity
@Audited(withModifiedFlag = true)
public class PersonContact extends Contact {
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String title;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String firstName;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Salutation salutation;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Gender gender;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String externalChatUsername;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public Salutation getSalutation() {
    return salutation;
  }

  public void setSalutation(Salutation salutation) {
    this.salutation = salutation;
  }

  public Gender getGender() {
    return gender;
  }

  public void setGender(Gender gender) {
    this.gender = gender;
  }

  public String getExternalChatUsername() {
    return externalChatUsername;
  }

  public void setExternalChatUsername(String externalChatUsername) {
    this.externalChatUsername = externalChatUsername;
  }
}
