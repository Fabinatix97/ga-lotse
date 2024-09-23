/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.persistence.entity;

import de.eshg.base.address.persistence.entity.Address;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import org.hibernate.envers.Audited;

/**
 * Hibernate envers does not support the "modified flag" feature for properties inside embeddables.
 * We can therefor not use the embeddable address entities here, but need to duplicate their
 * content! (see <a href="https://hibernate.atlassian.net/browse/HHH-10859">HHH-10859</a>)
 */
@Entity
@Audited(withModifiedFlag = true)
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class ContactAddress extends BaseEntity implements Address {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne
  private Contact contactOfContactAddress;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne
  private Contact contactOfDifferentBillingAddress;

  public Contact getContactOfContactAddress() {
    return contactOfContactAddress;
  }

  public void setContactOfContactAddress(Contact contactOfContactAddress) {
    this.contactOfContactAddress = contactOfContactAddress;
  }

  public Contact getContactOfDifferentBillingAddress() {
    return contactOfDifferentBillingAddress;
  }

  public void setContactOfDifferentBillingAddress(Contact contactOfDifferentBillingAddress) {
    this.contactOfDifferentBillingAddress = contactOfDifferentBillingAddress;
  }
}
