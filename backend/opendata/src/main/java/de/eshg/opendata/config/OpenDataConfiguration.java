/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import de.eshg.config.domain.MultiLangDocument;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotNull;

@Entity
public class OpenDataConfiguration extends BaseEntity {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean initialized = false;

  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String author;

  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String fallbackLicenseUrl;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.PERSIST, optional = false)
  private MultiLangDocument termsOfUse;

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

  boolean isInitialized() {
    return initialized;
  }

  void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }

  public MultiLangDocument getTermsOfUse() {
    return termsOfUse;
  }

  public void setTermsOfUse(MultiLangDocument termsOfUse) {
    this.termsOfUse = termsOfUse;
  }
}
