/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "CreatedByUserType")
public enum CreatedByUserTypeDto {
  EMPLOYEE,
  CITIZEN_PORTAL
}
