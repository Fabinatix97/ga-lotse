/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.config;

import static de.eshg.util.ResourceUtils.assertIsReadable;

import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.infectionbriefing.config")
public record InitialInfectionBriefingConfiguration(
    @NotNull Resource landingContentDe, @NotNull Resource landingContentEn) {

  public InitialInfectionBriefingConfiguration {
    assertIsReadable(landingContentDe, "Landing page markdown (de)");
    assertIsReadable(landingContentEn, "Landing page markdown (en)");
  }
}
