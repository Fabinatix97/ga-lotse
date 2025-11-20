/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ConsultationType")
public enum ConsultationTypeDto {
  INITIAL,
  FOLLOW_UP
}
