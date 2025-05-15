/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf.schoolinfoletter.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SchoolInfoLetterMeaslesContraIndicationDuration")
public enum SchoolInfoLetterMeaslesContraIndicationDurationDto {
  PERMANENT,
  TEMPORARY
}
