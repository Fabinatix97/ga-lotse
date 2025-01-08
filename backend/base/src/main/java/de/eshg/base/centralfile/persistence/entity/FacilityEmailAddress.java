/*
 * Copyright 2025 cronn GmbH
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
@Table(indexes = @Index(columnList = FacilityEmailAddress.FACILITY_ID))
public class FacilityEmailAddress extends SequencedBaseEntity {

  static final String FACILITY_ID = "facility_id";

  @ManyToOne(optional = false)
  @JoinColumn(name = FACILITY_ID)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Facility facility;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String emailAddress;

  public Facility getFacility() {
    return facility;
  }

  public void setFacility(Facility facility) {
    this.facility = facility;
  }

  public String getEmailAddress() {
    return emailAddress;
  }

  public void setEmailAddress(String emailAddress) {
    this.emailAddress = emailAddress;
  }
}
