/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.libservicedirectoryadminapi.api.staging;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "StagingStatus")
public enum StagingStatusDto {
  WORK_IN_PROGRESS,
  READY_FOR_REVIEW;

  public static StagingStatusDto from(Enum<?> e) {
    return e == null ? null : StagingStatusDto.valueOf(e.name());
  }
}
