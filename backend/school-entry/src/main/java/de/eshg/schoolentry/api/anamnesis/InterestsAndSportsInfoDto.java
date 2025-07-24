/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.anamnesis;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "InterestsAndSportsInfo")
public record InterestsAndSportsInfoDto(
    String clubSport,
    String otherInterests,
    Boolean canSwim,
    Boolean hasSeahorseBadge,
    MediaConsumptionDto mediaConsumption) {
  public InterestsAndSportsInfoDto() {
    this(null, null, null, null, null);
  }
}
