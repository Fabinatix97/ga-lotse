/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.anamnesis;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "DevelopmentInfo")
public record DevelopmentInfoDto(
    Boolean developmentConspicuities,
    Boolean infancyConspicuities,
    Boolean gestationalAge,
    Integer birthWeight,
    Integer dailyTeethBrushing,
    Boolean teethBrushingAfterCare,
    Boolean electricToothBrush,
    Boolean fluorideToothPaste) {
  public DevelopmentInfoDto() {
    this(null, null, null, null, null, null, null, null);
  }
}
