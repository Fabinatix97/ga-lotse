/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.medicalregistry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "TypeOfChange")
public enum TypeOfChangeDto {
  NEW_REGISTRATION,
  SECOND_PRACTICE,
  RE_REGISTRATION,
  CHANGE_OF_REGISTRATION,
  CHANGE_OF_NAME,
  RELOCATION,
  DEREGISTRATION,
  CHANGE_OF_EMPLOYEES,
  OTHER
}
