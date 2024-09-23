/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.citizenuser.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "CitizenUserRole")
public enum CitizenUserRoleDto {
  STANDARD_CITIZEN,
  ACCESS_CODE_USER,
  MUK_USER,
}
