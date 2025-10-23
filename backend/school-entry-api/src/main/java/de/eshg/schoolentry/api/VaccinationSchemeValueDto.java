/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "VaccinationSchemeValue")
public enum VaccinationSchemeValueDto {
  SCHEME_2_PLUS_1,
  SCHEME_3_PLUS_1,
  UNKNOWN,
}
