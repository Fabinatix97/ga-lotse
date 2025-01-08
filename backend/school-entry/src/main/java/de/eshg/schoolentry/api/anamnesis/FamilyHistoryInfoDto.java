/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.anamnesis;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "FamilyHistoryInfo")
public record FamilyHistoryInfoDto(
    Boolean spectaclesInFamily, String chronicIllnessOrDisabilityInFamily) {
  public FamilyHistoryInfoDto() {
    this(null, null);
  }
}
