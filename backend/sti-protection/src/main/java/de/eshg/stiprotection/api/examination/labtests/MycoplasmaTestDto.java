/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination.labtests;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = MycoplasmaTestDto.SCHEMA)
public record MycoplasmaTestDto(
    Boolean result, String value, String remark, Boolean oral, Boolean anal, Boolean urethral)
    implements LabTestDataDto {

  public static final String SCHEMA = "MycoplasmaTest";

  @Override
  public String type() {
    return SCHEMA;
  }
}
