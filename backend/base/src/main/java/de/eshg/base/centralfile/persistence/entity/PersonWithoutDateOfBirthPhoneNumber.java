/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.entity;

import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(
    indexes =
        @Index(columnList = PersonWithoutDateOfBirthPhoneNumber.PERSON_WITHOUT_DATE_OF_BIRTH_ID))
public class PersonWithoutDateOfBirthPhoneNumber extends SequencedBaseEntity {

  public static final String PERSON_WITHOUT_DATE_OF_BIRTH_ID = "person_without_date_of_birth_id";

  @ManyToOne(optional = false)
  @JoinColumn(name = PERSON_WITHOUT_DATE_OF_BIRTH_ID)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private PersonWithoutDateOfBirth person;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String phoneNumber;

  public PersonWithoutDateOfBirth getPerson() {
    return person;
  }

  public void setPerson(PersonWithoutDateOfBirth person) {
    this.person = person;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }
}
