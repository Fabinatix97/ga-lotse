/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "GdprProcedureStatus", description = "A list of statuses a GDPR procedure can have.")
public enum GdprProcedureStatusDto {
  DRAFT,
  OPEN,
  IN_PROGRESS,
  CLOSED,
  ABORTED;
}
