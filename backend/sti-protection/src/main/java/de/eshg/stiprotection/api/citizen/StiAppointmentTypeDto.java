/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.citizen;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "StiAppointmentType")
public enum StiAppointmentTypeDto {
  HIV_STI_CONSULTATION,
  SEX_WORK
}
