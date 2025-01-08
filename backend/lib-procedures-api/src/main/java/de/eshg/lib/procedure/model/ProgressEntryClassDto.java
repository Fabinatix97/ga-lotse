/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ProgressEntryClass")
public enum ProgressEntryClassDto {
  MANUAL_PROGRESS_ENTRY,
  SYSTEM_PROGRESS_ENTRY,
  PROCESSED_INBOX_PROGRESS_ENTRY
}
