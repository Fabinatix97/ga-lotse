/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.facility.websearch.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "WebSearchEntryStatus")
public enum WebSearchEntryStatusDto {
  /** new in remote data */
  NEW,
  /** facility has been assigned. */
  SAVED,
  /** remote data changed after facility has been assigned. */
  CHANGED,
  /** no longer available in remote data. */
  DELETED
}
