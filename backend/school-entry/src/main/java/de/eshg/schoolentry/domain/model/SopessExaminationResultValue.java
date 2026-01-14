/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SopessExaminationResultValue")
public enum SopessExaminationResultValue {
  OK,
  KNOWN,
  DOCTOR_LETTER,
  BORDERLINE,
  UNKNOWN
}
