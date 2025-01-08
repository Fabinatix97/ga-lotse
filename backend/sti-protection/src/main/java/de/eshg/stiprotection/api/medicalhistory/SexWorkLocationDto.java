/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "SexWorkLocation")
public enum SexWorkLocationDto {
  BORDELLO,
  CLUB,
  ESCORT,
  APARTMENT,
  APPOINTMENT_APARTMENT,
  MASSAGE_PARLOR,
  TANTRA_PRACTICE,
  STREET_PROSTITUTION,
  OTHER
}
