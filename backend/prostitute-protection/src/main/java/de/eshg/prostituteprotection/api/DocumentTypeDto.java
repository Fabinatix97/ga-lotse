/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "DocumentType")
public enum DocumentTypeDto {
  IDENTIFICATION_CARD,
  PASSPORT;
}
