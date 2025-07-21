/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "PrimaryLanguageValue")
public enum PrimaryLanguageValueDto {
  GERMAN,
  OTHER,
  OTHER_AND_GERMAN,
  MULTIPLE_OTHER,
  UNKNOWN
}
