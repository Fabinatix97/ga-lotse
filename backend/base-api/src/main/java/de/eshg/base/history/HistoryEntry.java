/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.history;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.UUID;

public interface HistoryEntry {
  HistoryEntryType type();

  @Schema(description = "Id of the history revision step.", example = "723")
  long historyId();

  @Schema(
      description = "The Id of the User who modified the Contact.",
      example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
  UUID modifiedBy();

  @Schema(
      description = "The date and time of when the Contact was modified.",
      example = "2024-02-01T00:00:00.123456Z")
  Instant modifiedAt();
}
