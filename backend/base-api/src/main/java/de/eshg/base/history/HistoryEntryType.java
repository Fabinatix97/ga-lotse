/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.history;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "The list of possible types of changes in the history.")
public enum HistoryEntryType {
  ADD,
  MOD,
  DEL,
}
