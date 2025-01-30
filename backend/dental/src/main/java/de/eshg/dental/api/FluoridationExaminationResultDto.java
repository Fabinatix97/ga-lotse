/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = FluoridationExaminationResultDto.SCHEMA_NAME)
public record FluoridationExaminationResultDto(@NotNull boolean fluorideVarnishApplied)
    implements ExaminationResultDto, IsFluorideVarnishApplicable {

  static final String SCHEMA_NAME = "FluoridationExaminationResult";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
