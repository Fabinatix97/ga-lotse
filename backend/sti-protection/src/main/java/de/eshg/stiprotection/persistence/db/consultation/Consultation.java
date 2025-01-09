/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.consultation;

import de.eshg.domain.model.GenericEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
public class Consultation extends GenericEntity<Long> {

  @Id private Long id;

  @MapsId
  @OneToOne(optional = false)
  private StiProtectionProcedure procedure;

  @Embedded private GeneralSection general;
  @Embedded private PregnancySection pregnancy;

  @Override
  public Long getId() {
    return id;
  }

  public StiProtectionProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(StiProtectionProcedure procedure) {
    this.procedure = procedure;
  }

  public GeneralSection getGeneral() {
    return general;
  }

  public void setGeneral(GeneralSection general) {
    this.general = general;
  }

  public PregnancySection getPregnancy() {
    return pregnancy;
  }

  public void setPregnancy(PregnancySection pregnancy) {
    this.pregnancy = pregnancy;
  }
}
