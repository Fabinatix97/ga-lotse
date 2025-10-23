/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "SocioEducationalPerformance",
    description = "Assessment of the social and educational performance")
public record SocioEducationalPerformanceDto(
    @Schema(description = "Indicates need for re-introduction.") Boolean reIntroduction,
    @Schema(description = "Indicates need for school counselling.") Boolean schoolCounselling,
    @Schema(description = "Indicates need for motor promotion.") Boolean motorPromotion,
    @Schema(description = "Indicates need for educational advice.") Boolean educationalAdvice,
    @Schema(description = "Indicates need for language advice.") Boolean languageAdvice,
    @Schema(description = "Indicates need for nutritional advice.") Boolean nutritionalAdvice,
    @Schema(description = "Indicates need for vaccination advice.") Boolean vaccinationAdvice,
    @Schema(description = "Indicates need for social services.") Boolean socialService,
    @Schema(description = "Indicates need for other types of support.") Boolean otherSupport,
    @Schema(description = "Indicates that an info letter must be issued.") Boolean infoLetter) {
  public SocioEducationalPerformanceDto() {
    this(null, null, null, null, null, null, null, null, null, null);
  }
}
