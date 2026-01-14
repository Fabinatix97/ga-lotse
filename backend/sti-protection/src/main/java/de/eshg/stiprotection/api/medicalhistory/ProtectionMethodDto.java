/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "ProtectionMethod",
    description = "Various methods used for protection and prevention in sexual health contexts.")
public enum ProtectionMethodDto {
  CONDOM,
  DENTAL_DAM,
  GLOVES,
  PREP,
  TASP,
  OTHER
}
