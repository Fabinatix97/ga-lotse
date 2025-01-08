/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.persistence.entity;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.envers.Audited;

@Entity
@Audited
@Table(indexes = @Index(columnList = "contact_id"))
public class ContactPhoneNumber extends BaseEntity {

  @ManyToOne(optional = false)
  @JoinColumn(name = "contact_id")
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Contact contact;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String phoneNumber;

  public Contact getContact() {
    return contact;
  }

  public void setContact(Contact contact) {
    this.contact = contact;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }
}
