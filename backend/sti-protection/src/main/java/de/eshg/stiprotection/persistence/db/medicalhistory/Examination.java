/*
 * Copyright 2025 cronn GmbH
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

  private Boolean hepA;
  private Boolean hepB;
  private Boolean hepC;
  private Boolean hiv;
  private Boolean syphilis;
  private Boolean gonorrhea;
  private Boolean chlamydia;

  private LocalDate hepADate;
  private LocalDate hepBDate;
  private LocalDate hepCDate;
  private LocalDate hivDate;
  private LocalDate syphilisDate;
  private LocalDate gonorrheaDate;
  private LocalDate chlamydiaDate;

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

  public LocalDate getHepADate() {
    return hepADate;
  }

  public void setHepADate(LocalDate hepADate) {
    this.hepADate = hepADate;
  }

  public LocalDate getHepBDate() {
    return hepBDate;
  }

  public void setHepBDate(LocalDate hepBDate) {
    this.hepBDate = hepBDate;
  }

  public LocalDate getHepCDate() {
    return hepCDate;
  }

  public void setHepCDate(LocalDate hepCDate) {
    this.hepCDate = hepCDate;
  }

  public LocalDate getHivDate() {
    return hivDate;
  }

  public void setHivDate(LocalDate hivDate) {
    this.hivDate = hivDate;
  }

  public LocalDate getSyphilisDate() {
    return syphilisDate;
  }

  public void setSyphilisDate(LocalDate syphilisDate) {
    this.syphilisDate = syphilisDate;
  }

  public LocalDate getGonorrheaDate() {
    return gonorrheaDate;
  }

  public void setGonorrheaDate(LocalDate gonorrheaDate) {
    this.gonorrheaDate = gonorrheaDate;
  }

  public LocalDate getChlamydiaDate() {
    return chlamydiaDate;
  }

  public void setChlamydiaDate(LocalDate chlamydiaDate) {
    this.chlamydiaDate = chlamydiaDate;
  }
}
