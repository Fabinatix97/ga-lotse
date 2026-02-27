/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.configuration;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "MeasuringDeviceType")
public enum MeasuringDeviceTypeDto {
  HEARING_TEST,
  SEEING_TEST
}
