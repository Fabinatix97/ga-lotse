/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Audited(withModifiedFlag = true)
@Table(indexes = @Index(columnList = "merged_into_id"))
public abstract class Contact extends GloballyUniqueEntityBase {
  @ManyToOne(fetch = FetchType.EAGER)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @JoinColumn(name = "merged_into_id")
  private Contact mergedInto;

  @OneToOne(fetch = FetchType.LAZY)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Contact mergedFrom;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String name;

  @OneToMany(
      fetch = FetchType.EAGER,
      mappedBy = ContactPhoneNumber_.CONTACT,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OrderBy
  private final List<ContactPhoneNumber> phoneNumbers = new ArrayList<>();

  @OneToMany(
      fetch = FetchType.EAGER,
      mappedBy = ContactEmailAddress_.CONTACT,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OrderBy
  private final List<ContactEmailAddress> emailAddresses = new ArrayList<>();

  @OneToOne(mappedBy = ContactAddress_.CONTACT_OF_CONTACT_ADDRESS)
  @NotAudited
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private ContactAddress contactAddress;

  @OneToOne(mappedBy = ContactAddress_.CONTACT_OF_DIFFERENT_BILLING_ADDRESS)
  @NotAudited
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private ContactAddress differentBillingAddress;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<ContactPhoneNumber> getPhoneNumbers() {
    return phoneNumbers;
  }

  public void addPhoneNumbers(List<ContactPhoneNumber> phoneNumbers) {
    phoneNumbers.forEach(a -> a.setContact(this));
    this.phoneNumbers.addAll(phoneNumbers);
  }

  public void removePhoneNumbers(Collection<ContactPhoneNumber> phoneNumbers) {
    phoneNumbers.forEach(a -> a.setContact(null));
    this.phoneNumbers.removeAll(phoneNumbers);
  }

  public List<ContactEmailAddress> getEmailAddresses() {
    return emailAddresses;
  }

  public void addEmailAddresses(List<ContactEmailAddress> emailAddresses) {
    emailAddresses.forEach(a -> a.setContact(this));
    this.emailAddresses.addAll(emailAddresses);
  }

  public void removeEmailAddresses(Collection<ContactEmailAddress> emailAddresses) {
    emailAddresses.forEach(a -> a.setContact(null));
    this.emailAddresses.removeAll(emailAddresses);
  }

  public ContactAddress getContactAddress() {
    return contactAddress;
  }

  public void setContactAddress(ContactAddress contactAddress) {
    this.contactAddress = contactAddress;
  }

  public ContactAddress getDifferentBillingAddress() {
    return differentBillingAddress;
  }

  public void setDifferentBillingAddress(ContactAddress differentBillingAddress) {
    this.differentBillingAddress = differentBillingAddress;
  }

  public Contact getMergedInto() {
    return mergedInto;
  }

  public void setMergedInto(Contact mergedInto) {
    this.mergedInto = mergedInto;
  }

  public Contact getMergedFrom() {
    return mergedFrom;
  }

  public void setMergedFrom(Contact mergedFrom) {
    this.mergedFrom = mergedFrom;
  }
}
