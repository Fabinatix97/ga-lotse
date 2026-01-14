/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.api.commons.HasTypeDiscriminator;
import io.swagger.v3.oas.annotations.media.Schema;

// Note: Using "ExaminationResult" leads to a Typescript compile error
@Schema(name = "DentalExaminationResult")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = FluoridationExaminationResultDto.class,
      name = FluoridationExaminationResultDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = ScreeningExaminationResultDto.class,
      name = ScreeningExaminationResultDto.SCHEMA_NAME),
  @JsonSubTypes.Type(
      value = AbsenceExaminationResultDto.class,
      name = AbsenceExaminationResultDto.SCHEMA_NAME)
})
public sealed interface ExaminationResultDto extends HasTypeDiscriminator
    permits FluoridationExaminationResultDto,
        ScreeningExaminationResultDto,
        AbsenceExaminationResultDto {}
