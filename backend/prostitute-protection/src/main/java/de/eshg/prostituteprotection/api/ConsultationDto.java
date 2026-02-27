/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "Consultation")
public record ConsultationDto(
    @NotNull
        @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        long version,
    @NotNull @Valid ConsultationParagraph7Dto paragraph7,
    @NotNull @Valid ConsultationParagraph10Dto paragraph10,
    LanguageDto languageOfConsultation,
    @NotNull boolean interpreterConsulted,
    String interpreterFirstName,
    String interpreterLastName) {
  public ConsultationDto(
      long version, ConsultationParagraph7Dto paragraph7, ConsultationParagraph10Dto paragraph10) {
    this(version, paragraph7, paragraph10, null, false, null, null);
  }
}
