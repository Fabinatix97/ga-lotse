/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Vaccination")
public enum VaccinationDto {
  HEPATITIS_A,
  HEPATITIS_B,

  HPV,
}
