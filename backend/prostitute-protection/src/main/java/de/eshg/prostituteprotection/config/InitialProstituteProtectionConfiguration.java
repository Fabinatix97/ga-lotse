/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.config;

import static de.eshg.util.ResourceUtils.assertIsReadable;

import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.prostitute-protection-service.config")
public record InitialProstituteProtectionConfiguration(
    @NotNull Resource landingContentDe, @NotNull Resource landingContentEn) {

  public InitialProstituteProtectionConfiguration {
    assertIsReadable(landingContentDe, "Landing page markdown (de)");
    assertIsReadable(landingContentEn, "Landing page markdown (en)");
  }
}
