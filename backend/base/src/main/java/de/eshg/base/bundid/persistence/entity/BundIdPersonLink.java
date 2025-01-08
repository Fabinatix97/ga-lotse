/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.bundid.persistence.entity;

import de.eshg.base.centralfile.persistence.entity.Person;
import de.eshg.base.centralfile.persistence.entity.Person_;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(indexes = {@Index(columnList = "reference_person_id"), @Index(columnList = "bund_id")})
public class BundIdPersonLink extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private String bundId;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = Person_.BUND_ID_PERSON_LINK)
  @MapsId
  private Person referencePerson;

  public String getBundId() {
    return bundId;
  }

  public void setBundId(String bundId) {
    this.bundId = bundId;
  }

  public Person getReferencePerson() {
    return referencePerson;
  }

  public void setReferencePerson(Person refPerson) {
    this.referencePerson = refPerson;
  }
}
