/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.persistence;

public enum WebSearchStatus {
  /** websearch has been freshly created but never run. */
  NEW,
  /** websearch has been executed and is now idle. */
  IDLE,
  /** websearch is running. */
  RUNNING,
  /** websearch is paused. Only manual execution is allowed, but not from background job. */
  PAUSED,
  /** websearch run into errors on the last run. */
  ERRONEOUS
}
