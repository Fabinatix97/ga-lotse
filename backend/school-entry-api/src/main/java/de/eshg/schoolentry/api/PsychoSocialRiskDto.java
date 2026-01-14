/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
