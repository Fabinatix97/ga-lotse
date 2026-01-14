/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ProcedureStatus")
public enum ProcedureStatusDto {
  DRAFT,
  OPEN,
  IN_PROGRESS,
  CLOSED,
  ABORTED
}
