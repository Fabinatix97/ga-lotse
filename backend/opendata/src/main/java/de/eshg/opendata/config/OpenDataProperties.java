/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import jakarta.validation.constraints.NotNull;
import java.net.URI;
import org.hibernate.validator.constraints.URL;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "de.eshg.opendata")
public class OpenDataProperties {

  @NotNull private String author;
  @NotNull private URI termsOfUse;

  @NotNull @URL
  private String fallbackLicenseUrl = "https://creativecommons.org/licenses/by/4.0/deed.de";

  public String getAuthor() {
    return author;
  }

  public void setAuthor(String author) {
    this.author = author;
  }

  public URI getTermsOfUse() {
    return termsOfUse;
  }

  public void setTermsOfUse(URI termsOfUse) {
    this.termsOfUse = termsOfUse;
  }

  public String getFallbackLicenseUrl() {
    return fallbackLicenseUrl;
  }

  public void setFallbackLicenseUrl(String fallbackLicenseUrl) {
    this.fallbackLicenseUrl = fallbackLicenseUrl;
  }
}
