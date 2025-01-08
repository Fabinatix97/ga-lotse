/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.persistence;

import de.eshg.base.centralfile.persistence.entity.BirthDetails;
import de.eshg.base.util.Salutation;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class GdprPerson extends IdentificationData {
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  String firstName;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  String lastName;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Embedded
  private BirthDetails birthDetails;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String emailAddress;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String phoneNumber;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String title;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Salutation salutation;

  @OneToOne(cascade = CascadeType.PERSIST)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private GdprPersonAddress contactAddress;

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public BirthDetails getBirthDetails() {
    return birthDetails;
  }

  public void setBirthDetails(BirthDetails birthDetails) {
    this.birthDetails = birthDetails;
  }

  public String getEmailAddress() {
    return emailAddress;
  }

  public void setEmailAddress(String emailAddress) {
    this.emailAddress = emailAddress;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Salutation getSalutation() {
    return salutation;
  }

  public void setSalutation(Salutation salutation) {
    this.salutation = salutation;
  }

  public GdprPersonAddress getContactAddress() {
    return contactAddress;
  }

  public void setContactAddress(GdprPersonAddress contactAddress) {
    this.contactAddress = contactAddress;
  }
}
