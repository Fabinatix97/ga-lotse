/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ProcedureSource")
public enum ProcedureSourceDto {
  STAFF_PORTAL,
  IMPORT
}
