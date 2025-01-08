/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SexualOrientation")
public enum SexualOrientationDto {
  HETEROSEXUAL,
  HOMOSEXUAL,
  BISEXUAL,
  NOT_SPECIFIED,
}
