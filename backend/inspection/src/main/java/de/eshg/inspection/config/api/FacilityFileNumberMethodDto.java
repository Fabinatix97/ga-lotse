/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.config.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "FacilityFileNumberMethod")
public enum FacilityFileNumberMethodDto {
  NO_FILE_NUMBERS,
  INSPECTION_FRANKFURT
}
