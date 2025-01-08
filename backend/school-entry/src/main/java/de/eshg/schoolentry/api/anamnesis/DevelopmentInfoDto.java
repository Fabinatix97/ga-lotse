/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.anamnesis;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "DevelopmentInfo")
public record DevelopmentInfoDto(
    Boolean developmentConspicuities,
    Boolean infancyConspicuities,
    Boolean gestationalAge,
    Integer birthWeight) {
  public DevelopmentInfoDto() {
    this(null, null, null, null);
  }
}
