/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.muk.persistence.entity;

import de.eshg.base.centralfile.persistence.entity.Facility;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;

@Entity
@Table(
    indexes = {
      @Index(columnList = MukFacilityLink.REFERENCE_FACILITY_ID),
      @Index(columnList = "data_transmitter_pseudonym_id")
    })
public class MukFacilityLink extends BaseEntity {

  public static final String REFERENCE_FACILITY_ID = "reference_facility_id";

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private String dataTransmitterPseudonymId;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = REFERENCE_FACILITY_ID)
  @MapsId
  private Facility referenceFacility;

  public String getDataTransmitterPseudonymId() {
    return dataTransmitterPseudonymId;
  }

  public void setDataTransmitterPseudonymId(String dataTransmitterPseudonymId) {
    this.dataTransmitterPseudonymId = dataTransmitterPseudonymId;
  }

  public Facility getReferenceFacility() {
    return referenceFacility;
  }

  public void setReferenceFacility(Facility referenceFacility) {
    this.referenceFacility = referenceFacility;
  }
}
