/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.testhelper.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "TeisDataCreationMode")
public enum TeisDataCreationModeDto {
  REAL_DATA,
  TEST_DATA
}
