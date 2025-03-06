/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.config;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class DepartmentConfiguration extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private byte[] logo;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private byte[] securityTxt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private byte[] securityTxtPublicKey;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private byte[] streetDirectory;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private byte[] municipalityDirectory;

  public byte[] getLogo() {
    return logo;
  }

  public void setLogo(byte[] logo) {
    this.logo = logo;
  }

  public byte[] getSecurityTxt() {
    return securityTxt;
  }

  public void setSecurityTxt(byte[] securityTxt) {
    this.securityTxt = securityTxt;
  }

  public byte[] getSecurityTxtPublicKey() {
    return securityTxtPublicKey;
  }

  public void setSecurityTxtPublicKey(byte[] securityTxtPublicKey) {
    this.securityTxtPublicKey = securityTxtPublicKey;
  }

  public byte[] getStreetDirectory() {
    return streetDirectory;
  }

  public void setStreetDirectory(byte[] streetDirectory) {
    this.streetDirectory = streetDirectory;
  }

  public byte[] getMunicipalityDirectory() {
    return municipalityDirectory;
  }

  public void setMunicipalityDirectory(byte[] municipalityDirectory) {
    this.municipalityDirectory = municipalityDirectory;
  }
}
