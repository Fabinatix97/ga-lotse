/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "SchoolFeedback",
    description = "Feedback from the school on the school entry examination.")
public enum SchoolFeedbackDto {
  POSITIVE,
  NEGATIVE,
  UNKNOWN
}
