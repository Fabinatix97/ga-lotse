/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.config;

import static de.eshg.util.ResourceUtils.assertIsReadable;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "de.eshg.official-medical-service.config")
public record InitialOmsConfiguration(
    @NotNull Resource concerns,
    @NotNull Resource landingContentDe,
    @NotNull Resource landingContentEn,
    @NotNull Duration keycloakUserCleanupJobOverdueDuration,
    @NotNull @PositiveOrZero Integer medicalOpinionCutOffDateLeadTime,
    @NotNull Boolean citizenPortalAnamnesisEnabled) {

  public InitialOmsConfiguration {
    assertIsReadable(concerns, "Concerns definition file (yaml, global)");
    assertIsReadable(landingContentDe, "Landing page markdown (de)");
    assertIsReadable(landingContentEn, "Landing page markdown (en)");
  }
}
