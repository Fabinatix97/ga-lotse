/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "EmploymentType")
public enum EmploymentTypeDto {
  FULL_TIME,
  PART_TIME,
}
