/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.opendata.config;

import static de.eshg.util.ResourceUtils.assertIsReadable;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.URL;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.core.io.Resource;

@ConfigurationProperties(prefix = "de.eshg.opendata")
public record InitialOpenDataConfiguration(
    @NotNull String author,
    @NotNull Resource termsOfUse,
    @NotNull @URL @DefaultValue("https://creativecommons.org/licenses/by/4.0/deed.de")
        String fallbackLicenseUrl) {

  public InitialOpenDataConfiguration {
    assertIsReadable(termsOfUse, "termsOfUse");
  }
}
