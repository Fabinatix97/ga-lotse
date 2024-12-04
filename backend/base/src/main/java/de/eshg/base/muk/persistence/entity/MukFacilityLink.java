/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.muk.persistence.entity;

import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;

@Entity
@Table(indexes = @Index(columnList = "reference_facility_id"))
public class MukFacilityLink extends BaseEntity {

  public MukFacilityLink() {}

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private String mukId;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(optional = false, fetch = FetchType.LAZY)
  private Facility referenceFacility;

  public String getMukId() {
    return mukId;
  }

  public void setMukId(String mukId) {
    this.mukId = mukId;
  }

  public Facility getReferenceFacility() {
    return referenceFacility;
  }

  public void setReferenceFacility(Facility referenceFacility) {
    this.referenceFacility = referenceFacility;
  }
}
