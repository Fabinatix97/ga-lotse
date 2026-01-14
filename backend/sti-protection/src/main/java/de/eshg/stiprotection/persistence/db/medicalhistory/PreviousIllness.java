/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;

@Embeddable
@DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
public class PreviousIllness {

  private Boolean hepA;
  private Boolean hepB;
  private Boolean hepC;
  private Boolean hiv;
  private Boolean syphilis;
  private Boolean gonorrhea;
  private Boolean chlamydia;
  private Boolean other;

  private String otherData;

  public Boolean getHepA() {
    return hepA;
  }

  public void setHepA(Boolean hepA) {
    this.hepA = hepA;
  }

  public Boolean getHepB() {
    return hepB;
  }

  public void setHepB(Boolean hepB) {
    this.hepB = hepB;
  }

  public Boolean getHepC() {
    return hepC;
  }

  public void setHepC(Boolean hepC) {
    this.hepC = hepC;
  }

  public Boolean getHiv() {
    return hiv;
  }

  public void setHiv(Boolean hiv) {
    this.hiv = hiv;
  }

  public Boolean getSyphilis() {
    return syphilis;
  }

  public void setSyphilis(Boolean syphilis) {
    this.syphilis = syphilis;
  }

  public Boolean getGonorrhea() {
    return gonorrhea;
  }

  public void setGonorrhea(Boolean gonorrhea) {
    this.gonorrhea = gonorrhea;
  }

  public Boolean getChlamydia() {
    return chlamydia;
  }

  public void setChlamydia(Boolean chlamydia) {
    this.chlamydia = chlamydia;
  }

  public Boolean getOther() {
    return other;
  }

  public void setOther(Boolean other) {
    this.other = other;
  }

  public String getOtherData() {
    return otherData;
  }

  public void setOtherData(String otherData) {
    this.otherData = otherData;
  }
}
