/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import java.time.LocalDate;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class ContactDetails extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private ContactType contactType;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private String facilityName;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String firstName;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String lastName;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column
  private Title title;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private LocalDate dateOfBirth;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String emailAddress;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String phoneNumber;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(optional = false, fetch = FetchType.LAZY)
  private InboxProcedure inboxProcedure;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(mappedBy = "contactDetails", cascade = CascadeType.PERSIST, orphanRemoval = true)
  private Address address;

  public ContactType getContactType() {
    return contactType;
  }

  public void setContactType(ContactType contactType) {
    this.contactType = contactType;
  }

  public String getFacilityName() {
    return facilityName;
  }

  public void setFacilityName(String facilityName) {
    this.facilityName = facilityName;
  }

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

  public Title getTitle() {
    return title;
  }

  public void setTitle(Title title) {
    this.title = title;
  }

  public LocalDate getDateOfBirth() {
    return dateOfBirth;
  }

  public void setDateOfBirth(LocalDate dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
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

  public InboxProcedure getInboxProcedure() {
    return inboxProcedure;
  }

  public void setInboxProcedure(InboxProcedure inboxProcedure) {
    this.inboxProcedure = inboxProcedure;
  }

  public Address getAddress() {
    return address;
  }

  public void setAddress(Address address) {
    this.address = address;
  }

  public void addAddress(Address address) {
    setAddress(address);

    if (address != null) {
      address.setContactDetails(this);
    }
  }
}
