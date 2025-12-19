/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "OrthodonticStatus")
public enum OrthodonticStatusDto {
  WITHOUT_FINDINGS,
  TREATMENT_STARTED,
  TREATMENT_REQUIRED,
  TREATMENT_PLANNED,
  TREATMENT_COMPLETED,
  TREATMENT_CANCELED,
  UNDER_OBSERVATION
}
