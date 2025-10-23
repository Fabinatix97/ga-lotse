/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
