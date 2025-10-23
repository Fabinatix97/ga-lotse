/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SchoolEntryStatusType")
public enum ProcedureStatusDto {
  DRAFT,
  OPEN,
  IN_PROGRESS,
  CLOSED,
  ABORTED;
}
