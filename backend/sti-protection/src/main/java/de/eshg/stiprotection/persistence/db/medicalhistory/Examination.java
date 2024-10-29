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
public class Examination {

  private LocalDate hepA;
  private LocalDate hepB;
  private LocalDate hepC;
  private LocalDate hiv;
  private LocalDate syphilis;
  private LocalDate gonorrhea;
  private LocalDate chlamydia;

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

  public LocalDate getHepC() {
    return hepC;
  }

  public void setHepC(LocalDate hepC) {
    this.hepC = hepC;
  }

  public LocalDate getHiv() {
    return hiv;
  }

  public void setHiv(LocalDate hiv) {
    this.hiv = hiv;
  }

  public LocalDate getSyphilis() {
    return syphilis;
  }

  public void setSyphilis(LocalDate syphilis) {
    this.syphilis = syphilis;
  }

  public LocalDate getGonorrhea() {
    return gonorrhea;
  }

  public void setGonorrhea(LocalDate gonorrhea) {
    this.gonorrhea = gonorrhea;
  }

  public LocalDate getChlamydia() {
    return chlamydia;
  }

  public void setChlamydia(LocalDate chlamydia) {
    this.chlamydia = chlamydia;
  }
}
