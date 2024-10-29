/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db.medicalhistory;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
public class PreviousIllness {

  @Column(nullable = false)
  private Boolean hepA;

  @Column(nullable = false)
  private Boolean hepB;

  @Column(nullable = false)
  private Boolean hepC;

  @Column(nullable = false)
  private Boolean hiv;

  @Column(nullable = false)
  private Boolean syphilis;

  @Column(nullable = false)
  private Boolean gonorrhea;

  @Column(nullable = false)
  private Boolean chlamydia;

  private String otherPreviousIllnesses;

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

  public String getOtherPreviousIllnesses() {
    return otherPreviousIllnesses;
  }

  public void setOtherPreviousIllnesses(String otherPreviousIllnesses) {
    this.otherPreviousIllnesses = otherPreviousIllnesses;
  }
}
