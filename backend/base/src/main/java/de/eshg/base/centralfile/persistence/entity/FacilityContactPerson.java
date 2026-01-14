/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.entity;

import de.eshg.base.util.Gender;
import de.eshg.base.util.Salutation;
import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(indexes = @Index(columnList = FacilityContactPerson.FACILITY_ID))
public class FacilityContactPerson extends SequencedBaseEntityWithExternalId {

  static final String FACILITY_ID = "facility_id";

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = FACILITY_ID)
  private Facility facility;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String emailAddress;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String phoneNumber;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private String role;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String lastName;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String firstName;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String title;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Salutation salutation;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Gender gender;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @ColumnDefault("false")
  private boolean mainContact;

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

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
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

  public Gender getGender() {
    return gender;
  }

  public void setGender(Gender gender) {
    this.gender = gender;
  }

  public Facility getFacility() {
    return facility;
  }

  public void setFacility(Facility facility) {
    this.facility = facility;
  }

  public boolean isMainContact() {
    return mainContact;
  }

  public void setMainContact(boolean mainContact) {
    this.mainContact = mainContact;
  }

  public FacilityContactPerson cloneFromFileState() {
    FacilityContactPerson clone = new FacilityContactPerson();
    clone.setEmailAddress(getEmailAddress());
    clone.setPhoneNumber(getPhoneNumber());
    clone.setRole(getRole());
    clone.setLastName(getLastName());
    clone.setFirstName(getFirstName());
    clone.setTitle(getTitle());
    clone.setSalutation(getSalutation());
    clone.setGender(getGender());

    // We don't want main contacts to be saved in the reference facility
    clone.setMainContact(false);

    return clone;
  }
}
