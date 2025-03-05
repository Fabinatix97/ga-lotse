/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.config;

import de.eshg.util.ResourceUtils;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;

@ConfigurationProperties("de.eshg.measles-protection")
public record InitialMeaslesProtectionConfiguration(
    @NotNull Resource privacyNotice, @NotNull Resource privacyPolicy) {

  public InitialMeaslesProtectionConfiguration {
    ResourceUtils.assertIsReadable(privacyNotice, "privacyNotice");
    ResourceUtils.assertIsReadable(privacyPolicy, "privacyPolicy");
  }
}
