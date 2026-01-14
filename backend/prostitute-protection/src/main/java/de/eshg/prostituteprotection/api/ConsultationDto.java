/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "Consultation")
public record ConsultationDto(
    @NotNull
        @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        long version,
    @NotNull boolean legalAdvices,
    @NotNull boolean healthAndSocialInsurance,
    @NotNull boolean consultingServices,
    @NotNull boolean emergencyHelp,
    @NotNull boolean taxLiability,
    @NotNull boolean clearing,
    @NotNull boolean informationMaterial,
    @NotNull boolean predicament,
    @NotNull boolean diseasePrevention,
    @NotNull boolean birthControl,
    @NotNull boolean pregnancy,
    @NotNull boolean alcoholAndDrugUsage,
    @NotNull boolean referral,
    @NotNull boolean supervisedConsultation,
    String remark,
    LanguageDto languageOfConsultation,
    @NotNull boolean interpreterConsulted,
    String interpreterFirstName,
    String interpreterLastName) {
  public ConsultationDto(
      long version,
      boolean legalAdvices,
      boolean healthAndSocialInsurance,
      boolean consultingServices,
      boolean emergencyHelp,
      boolean taxLiability,
      boolean clearing,
      boolean informationMaterial,
      boolean predicament,
      boolean diseasePrevention,
      boolean birthControl,
      boolean pregnancy,
      boolean alcoholAndDrugUsage,
      boolean referral) {
    this(
        version,
        legalAdvices,
        healthAndSocialInsurance,
        consultingServices,
        emergencyHelp,
        taxLiability,
        clearing,
        informationMaterial,
        predicament,
        diseasePrevention,
        birthControl,
        pregnancy,
        alcoholAndDrugUsage,
        referral,
        false,
        null,
        null,
        false,
        null,
        null);
  }
}
