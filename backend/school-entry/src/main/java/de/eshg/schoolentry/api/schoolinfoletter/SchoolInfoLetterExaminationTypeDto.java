/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SchoolInfoLetterExaminationType")
public enum SchoolInfoLetterExaminationTypeDto {
  REGULAR_EXAMINATION,
  CAN_CHILD,
  ENTRY_LEVEL,
}
