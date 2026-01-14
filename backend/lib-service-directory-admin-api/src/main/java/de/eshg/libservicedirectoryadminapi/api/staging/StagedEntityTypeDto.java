/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.staging;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AdminStagedEntityType")
public enum StagedEntityTypeDto {
  ADD,
  MOD,
  DEL,
  ;

  public static StagedEntityTypeDto from(Enum<?> e) {
    return e == null ? null : StagedEntityTypeDto.valueOf(e.name());
  }
}
