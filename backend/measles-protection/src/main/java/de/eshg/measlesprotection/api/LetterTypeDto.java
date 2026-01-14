/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "LetterType")
public enum LetterTypeDto {
  LETTER_TO_PATIENT,
  LETTER_TO_CUSTODIAN,
  LETTER_TO_FACILITY
}
