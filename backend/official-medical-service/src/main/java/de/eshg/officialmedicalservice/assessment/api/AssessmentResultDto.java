/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.assessment.api;

import de.eshg.lib.assessment.domain.model.AssessmentResult;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * @see AssessmentResult
 */
@Schema(name = "OmsAssessmentResult")
public enum AssessmentResultDto {
  POSITIVE,
  NEGATIVE,
  UNDETERMINED
}
