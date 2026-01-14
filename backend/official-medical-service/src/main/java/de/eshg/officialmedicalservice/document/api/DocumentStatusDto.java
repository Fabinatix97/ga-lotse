/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.document.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "DocumentStatus")
public enum DocumentStatusDto {
  MISSING,
  SUBMITTED,
  REJECTED,
  ACCEPTED,
}
