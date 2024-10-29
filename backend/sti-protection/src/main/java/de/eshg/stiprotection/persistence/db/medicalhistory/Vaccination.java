/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
public class Vaccination {

  private LocalDate hepA;
  private LocalDate hepB;
  private LocalDate hpv;

  public LocalDate getHepA() {
    return hepA;
  }

  public void setHepA(LocalDate hepA) {
    this.hepA = hepA;
  }

  public LocalDate getHepB() {
    return hepB;
  }

  public void setHepB(LocalDate hepB) {
    this.hepB = hepB;
  }

  public LocalDate getHpv() {
    return hpv;
  }

  public void setHpv(LocalDate hpv) {
    this.hpv = hpv;
  }
}
