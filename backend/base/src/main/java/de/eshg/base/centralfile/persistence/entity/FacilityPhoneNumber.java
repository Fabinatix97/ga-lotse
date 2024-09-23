/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.entity;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(indexes = @Index(columnList = FacilityPhoneNumber.FACILITY_ID))
public class FacilityPhoneNumber extends BaseEntity {

  static final String FACILITY_ID = "facility_id";

  @ManyToOne(optional = false)
  @JoinColumn(name = FACILITY_ID)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Facility facility;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String phoneNumber;

  public Facility getFacility() {
    return facility;
  }

  public void setFacility(Facility facility) {
    this.facility = facility;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }
}
