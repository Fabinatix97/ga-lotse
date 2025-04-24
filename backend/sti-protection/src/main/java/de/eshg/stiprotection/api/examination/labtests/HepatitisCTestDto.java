/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination.labtests;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = HepatitisCTestDto.SCHEMA)
public record HepatitisCTestDto(Boolean result, String value, String remark)
    implements LabTestDataDto {

  public static final String SCHEMA = "HepatitisCTest";

  @Override
  public String type() {
    return SCHEMA;
  }
}
