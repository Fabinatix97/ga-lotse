/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
