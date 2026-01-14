/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "SexualOrientation",
    description =
        "Patient’s sexual orientation, which refers to the pattern of romantic or sexual attraction to individuals of specific genders.")
public enum SexualOrientationDto {
  HETEROSEXUAL,
  HOMOSEXUAL,
  BISEXUAL,
  NOT_SPECIFIED,
}
