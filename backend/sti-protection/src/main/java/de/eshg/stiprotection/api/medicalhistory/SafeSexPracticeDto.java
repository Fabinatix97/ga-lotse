/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "SafeSexPractice",
    description = "The extent to which a patient engages in practices considered safe sex.")
public enum SafeSexPracticeDto {
  ALWAYS,
  FREQUENTLY,
  OCCASIONALLY,
  NEVER
}
