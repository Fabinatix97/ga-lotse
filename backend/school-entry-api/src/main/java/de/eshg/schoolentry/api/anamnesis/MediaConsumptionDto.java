/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.anamnesis;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "MediaConsumption")
public enum MediaConsumptionDto {
  LITTLE,
  MEDIUM,
  MUCH
}
