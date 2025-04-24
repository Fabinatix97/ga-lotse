/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import de.eshg.config.domain.Document;
import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotNull;
import org.springframework.util.Assert;

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

  @NotNull
  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
  private Document termsOfUse;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  private int termsOfUseFileSizeBytes;

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
    return termsOfUse.getContent();
  }

  public void setTermsOfUse(byte[] termsOfUse) {
    Assert.state(termsOfUse != null, "termsOfUse must not be null");
    this.termsOfUse = new Document();
    this.termsOfUse.setContent(termsOfUse);
    this.termsOfUseFileSizeBytes = termsOfUse.length;
  }

  boolean isInitialized() {
    return initialized;
  }

  void setInitialized(boolean initialized) {
    this.initialized = initialized;
  }

  int getTermsOfUseFileSizeBytes() {
    return termsOfUseFileSizeBytes;
  }
}
