/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.diagnosis;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "TestType",
    description = "Specifies the type of laboratory tests conducted during examination.")
public enum TestTypeDto {
  WESTERN_BLOT,
  P24,
  PCR,
  OTHER
}
