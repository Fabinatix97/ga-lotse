/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "DocumentType")
public enum DocumentTypeDto {
  IDENTIFICATION_CARD,
  PASSPORT,
  RESIDENCE_PERMIT,
  TOLERANCE_PERMIT,
  OTHER;
}
