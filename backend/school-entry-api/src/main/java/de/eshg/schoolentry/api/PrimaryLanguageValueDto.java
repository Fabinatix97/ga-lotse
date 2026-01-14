/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
