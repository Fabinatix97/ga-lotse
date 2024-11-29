/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "TypeOfFullProcedureChange")
public enum TypeOfFullProcedureChangeDto {
  NEW_REGISTRATION,
  SECOND_PRACTICE,
  RE_REGISTRATION,
  CHANGE_OF_REGISTRATION,
  CHANGE_OF_NAME,
  OTHER
}
