/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ConfigurationStatus")
public enum ConfigurationStatusDto {
  COMPLETE,
  PARTIALLY_COMPLETE,
  INCOMPLETE
}
