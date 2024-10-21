/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "PersonType")
public enum PersonTypeDto {
  PATIENT,
  PARENT,
  PROFESSIONAL
}
