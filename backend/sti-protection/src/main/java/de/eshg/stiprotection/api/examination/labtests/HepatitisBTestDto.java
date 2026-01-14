/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination.labtests;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = HepatitisBTestDto.SCHEMA)
public record HepatitisBTestDto(
    Boolean result, String value, String remark, Boolean infection, Boolean vaccineTitre)
    implements LabTestDataDto {

  public static final String SCHEMA = "HepatitisBTest";

  @Override
  public String type() {
    return SCHEMA;
  }
}
