/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;

@Entity
public class OpenDataConfiguration extends BaseEntity {

  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String author;

  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String fallbackLicenseUrl;

  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private byte[] termsOfUse;

  public String getAuthor() {
    return author;
  }

  public void setAuthor(String author) {
    this.author = author;
  }

  public String getFallbackLicenseUrl() {
    return fallbackLicenseUrl;
  }

  public void setFallbackLicenseUrl(String fallbackLicenseUrl) {
    this.fallbackLicenseUrl = fallbackLicenseUrl;
  }

  public byte[] getTermsOfUse() {
    return termsOfUse;
  }

  public void setTermsOfUse(byte[] termsOfUse) {
    this.termsOfUse = termsOfUse;
  }
}
