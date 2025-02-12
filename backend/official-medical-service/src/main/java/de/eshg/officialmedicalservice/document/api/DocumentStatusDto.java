/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
