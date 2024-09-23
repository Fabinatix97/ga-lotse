/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "DisabilityType",
    description =
        "Type of the disability. This field can be used to indicate whether the disability is physical, mental, emotional or has multiple manifestations.")
public enum DisabilityTypeDto {
  PHYSICAL,
  MENTAL,
  EMOTIONAL,
  MULTIPLE
}
