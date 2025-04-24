/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination.labtests;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = SyphilisTestDto.SCHEMA)
public record SyphilisTestDto(Boolean result, String value, String remark, Boolean hadSyphilis)
    implements LabTestDataDto {

  public static final String SCHEMA = "SyphilisTest";

  @Override
  public String type() {
    return SCHEMA;
  }
}
