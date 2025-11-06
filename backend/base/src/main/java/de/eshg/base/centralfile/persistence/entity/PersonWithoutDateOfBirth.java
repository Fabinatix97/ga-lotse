/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.entity;

import de.eshg.base.util.Gender;
import de.eshg.base.util.Salutation;
import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class PersonWithoutDateOfBirth extends SequencedBaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  @CreatedDate
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Instant modifiedAt;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Instant deleteAt;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  String firstName;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  String lastName;

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = PersonWithoutDateOfBirthEmailAddress_.PERSON,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OrderBy
  @BatchSize(size = 100)
  private final List<PersonWithoutDateOfBirthEmailAddress> emailAddresses = new ArrayList<>();

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = PersonWithoutDateOfBirthPhoneNumber_.PERSON,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OrderBy
  @BatchSize(size = 100)
  private final List<PersonWithoutDateOfBirthPhoneNumber> phoneNumbers = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String title;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Salutation salutation;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Gender gender;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private DataOrigin dataOrigin;

  @OneToOne(cascade = CascadeType.PERSIST, orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private PersonAddress contactAddress;

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public void setModifiedAt(Instant date) {
    this.modifiedAt = date;
  }

  public Instant getDeleteAt() {
    return deleteAt;
  }

  public void setDeleteAt(Instant deleteAt) {
    this.deleteAt = deleteAt;
  }

  public DataOrigin getDataOrigin() {
    return dataOrigin;
  }

  public void setDataOrigin(DataOrigin dataOrigin) {
    this.dataOrigin = dataOrigin;
  }

  public List<PersonWithoutDateOfBirthEmailAddress> getEmailAddresses() {
    return emailAddresses;
  }

  public void setEmailAddresses(List<PersonWithoutDateOfBirthEmailAddress> emailAddresses) {
    removeEmailAddresses(getEmailAddresses());
    ArrayList<PersonWithoutDateOfBirthEmailAddress> newEmailAddresses =
        emailAddresses.stream()
            .map(this::cloneEmailAddress)
            .collect(Collectors.toCollection(ArrayList::new));
    this.addEmailAddresses(newEmailAddresses);
  }

  private PersonWithoutDateOfBirthEmailAddress cloneEmailAddress(
      PersonWithoutDateOfBirthEmailAddress emailAddress) {
    PersonWithoutDateOfBirthEmailAddress clone = new PersonWithoutDateOfBirthEmailAddress();
    clone.setPerson(null);
    clone.setEmailAddress(emailAddress.getEmailAddress());
    return clone;
  }

  public void addEmailAddresses(Collection<PersonWithoutDateOfBirthEmailAddress> newEmail) {
    newEmail.forEach(a -> a.setPerson(this));
    this.emailAddresses.addAll(newEmail);
  }

  public void removeEmailAddresses(
      Collection<PersonWithoutDateOfBirthEmailAddress> removedEmailAddresses) {
    removedEmailAddresses.forEach(a -> a.setPerson(null));
    this.emailAddresses.removeAll(removedEmailAddresses);
  }

  public List<PersonWithoutDateOfBirthPhoneNumber> getPhoneNumbers() {
    return phoneNumbers;
  }

  public void setPhoneNumbers(List<PersonWithoutDateOfBirthPhoneNumber> phoneNumbers) {
    removePhoneNumbers(getPhoneNumbers());
    ArrayList<PersonWithoutDateOfBirthPhoneNumber> newPhoneNumbers =
        phoneNumbers.stream()
            .map(this::clonePhoneNumber)
            .collect(Collectors.toCollection(ArrayList::new));
    this.addPhoneNumbers(newPhoneNumbers);
  }

  private PersonWithoutDateOfBirthPhoneNumber clonePhoneNumber(
      PersonWithoutDateOfBirthPhoneNumber phoneNumber) {
    PersonWithoutDateOfBirthPhoneNumber clone = new PersonWithoutDateOfBirthPhoneNumber();
    clone.setPerson(null);
    clone.setPhoneNumber(phoneNumber.getPhoneNumber());
    return clone;
  }

  public void addPhoneNumbers(Collection<PersonWithoutDateOfBirthPhoneNumber> newPhone) {
    newPhone.forEach(a -> a.setPerson(this));
    this.phoneNumbers.addAll(newPhone);
  }

  public void removePhoneNumbers(
      Collection<PersonWithoutDateOfBirthPhoneNumber> removedPhoneNumbers) {
    removedPhoneNumbers.forEach(a -> a.setPerson(null));
    this.phoneNumbers.removeAll(removedPhoneNumbers);
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

  public PersonAddress getContactAddress() {
    return contactAddress;
  }

  public void setContactAddress(PersonAddress contactAddress) {
    this.contactAddress = contactAddress;
  }
}
