/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.schoolinfoletter;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SchoolInfoLetterMeaslesContraIndicationDuration")
public enum SchoolInfoLetterMeaslesContraIndicationDurationDto {
  PERMANENT,
  TEMPORARY
}
