/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.persistence;

import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(indexes = {@Index(columnList = "procedure_id"), @Index(columnList = "facility_id")})
public class InspectionRelatedFacility extends RelatedFacility<Inspection> {
  @ManyToOne(optional = false)
  @JoinColumn(name = "facility_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Facility facility;

  public Facility getFacility() {
    return facility;
  }

  public void setFacility(Facility facility) {
    this.facility = facility;
  }
}
