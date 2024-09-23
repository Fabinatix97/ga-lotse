/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.anamnesis;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(name = "PromotionTherapyAndAidInfo")
public record PromotionTherapyAndAidInfoDto(
    Boolean visionImpairment,
    Boolean hearingImpairment,
    Boolean speechImpairment,
    LocalDate spectaclesSince,
    LocalDate visionSchoolSince,
    String hearingAid,
    LocalDate speechTherapyStart,
    LocalDate speechTherapyEnd,
    LocalDate ergoTherapyStart,
    LocalDate ergoTherapyEnd,
    LocalDate physioTherapyStart,
    LocalDate physioTherapyEnd,
    String additionalTherapies) {
  public PromotionTherapyAndAidInfoDto() {
    this(null, null, null, null, null, null, null, null, null, null, null, null, null);
  }
}
