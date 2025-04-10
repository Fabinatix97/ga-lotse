/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.api.evaluation;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "EvaluationState")
public enum EvaluationStateDto {
  COMPLETED,
  FAILED,
  CREATING,
  UPDATING,
  COPY_ONGOING,
  DELETING,
  ANONYMIZATION_FAILED
}
