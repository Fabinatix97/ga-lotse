/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "PsychoSocialRisk", description = "Assessment of the psychosocial risk.")
public record PsychoSocialRiskDto(
    @Schema(description = "Indicates family-related issues.") Boolean family,
    @Schema(description = "Indicates non-compliance issues.") Boolean nonCompliance,
    @Schema(description = "Indicates social issues.") Boolean social,
    @Schema(description = "Indicates migration-related issues.") Boolean migration,
    @Schema(description = "Indicates other potential risks.") Boolean otherRisk) {
  public PsychoSocialRiskDto() {
    this(null, null, null, null, null);
  }
}
