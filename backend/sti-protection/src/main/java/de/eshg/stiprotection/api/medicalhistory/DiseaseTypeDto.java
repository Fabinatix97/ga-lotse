/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "DiseaseType")
public enum DiseaseTypeDto {
  CHLAMYDIA,
  GONORRHEA,
  HEPATITIS_A,
  HEPATITIS_B,
  HEPATITIS_C,
  HIV,
  HPV,
  SYPHILIS,
}
