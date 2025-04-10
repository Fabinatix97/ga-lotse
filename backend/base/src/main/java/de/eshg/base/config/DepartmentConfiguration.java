/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.config.domain.Document;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class DepartmentConfiguration extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private Document logo;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private Document securityTxt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private Document securityTxtPublicKey;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private Document streetDirectory;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private Document municipalityDirectory;

  public Document getLogo() {
    return logo;
  }

  public void setLogo(Document logo) {
    this.logo = logo;
  }

  public Document getSecurityTxt() {
    return securityTxt;
  }

  public void setSecurityTxt(Document securityTxt) {
    this.securityTxt = securityTxt;
  }

  public Document getSecurityTxtPublicKey() {
    return securityTxtPublicKey;
  }

  public void setSecurityTxtPublicKey(Document securityTxtPublicKey) {
    this.securityTxtPublicKey = securityTxtPublicKey;
  }

  public Document getStreetDirectory() {
    return streetDirectory;
  }

  public void setStreetDirectory(Document streetDirectory) {
    this.streetDirectory = streetDirectory;
  }

  public Document getMunicipalityDirectory() {
    return municipalityDirectory;
  }

  public void setMunicipalityDirectory(Document municipalityDirectory) {
    this.municipalityDirectory = municipalityDirectory;
  }
}
