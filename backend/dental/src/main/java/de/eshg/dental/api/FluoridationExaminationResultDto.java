/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = FluoridationExaminationResultDto.SCHEMA_NAME)
public record FluoridationExaminationResultDto(Boolean fluorideVarnishApplied)
    implements ExaminationResultDto, IsFluorideVarnishApplicable {

  static final String SCHEMA_NAME = "FluoridationExaminationResult";

  public FluoridationExaminationResultDto() {
    this(null);
  }

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
