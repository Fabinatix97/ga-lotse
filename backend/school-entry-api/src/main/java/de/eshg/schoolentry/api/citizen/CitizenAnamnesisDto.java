/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.citizen;

import de.eshg.schoolentry.api.*;
import de.eshg.schoolentry.api.anamnesis.*;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "CitizenAnamnesis")
public record CitizenAnamnesisDto(
    @NotNull @Valid CitizenMigrationBackgroundDto migrationBackground,
    @Schema(
            description =
                "Boolean that indicates, if the child participated in a preliminary course.")
        Boolean preliminaryCourse,
    @Schema(
            description =
                "Boolean that indicates, if the child participated in the KiSS language screening.")
        Boolean childLanguageScreening,
    @Schema(
            description =
                "Boolean that indicates, if the KiSS language screening documents are allowed to be viewed during the examination.")
        Boolean languageScreeningConsent,
    @NotNull @Valid PromotionBeforeSchoolEntryDto promotionBeforeSchoolEntry,
    @NotNull @Valid CitizenAdditionalChildInfoDto additionalChildInfo,
    @NotNull @Valid DaycareAndSchoolInfoDto daycareAndSchoolInfo,
    @NotNull @Valid FamilyHistoryInfoDto familyHistoryInfo,
    @NotNull @Valid DevelopmentInfoDto developmentInfo,
    @NotNull @Valid IllnessAndAccidentInfoDto illnessAndAccidentInfo,
    @NotNull @Valid PromotionTherapyAndAidInfoDto promotionTherapyAndAidInfo,
    @NotNull @Valid InterestsAndSportsInfoDto interestsAndSportsInfo,
    Boolean personalConspicuities) {
  public CitizenAnamnesisDto(
      CitizenMigrationBackgroundDto migrationBackground,
      Boolean preliminaryCourse,
      Boolean childLanguageScreening,
      PromotionBeforeSchoolEntryDto promotionBeforeSchoolEntry) {
    this(
        migrationBackground,
        preliminaryCourse,
        childLanguageScreening,
        null,
        promotionBeforeSchoolEntry,
        new CitizenAdditionalChildInfoDto(),
        new DaycareAndSchoolInfoDto(),
        new FamilyHistoryInfoDto(),
        new DevelopmentInfoDto(),
        new IllnessAndAccidentInfoDto(),
        new PromotionTherapyAndAidInfoDto(),
        new InterestsAndSportsInfoDto(),
        null);
  }

  public CitizenAnamnesisDto(DaycareAndSchoolInfoDto daycareAndSchoolInfo) {
    this(
        new CitizenMigrationBackgroundDto(),
        null,
        null,
        null,
        new PromotionBeforeSchoolEntryDto(),
        new CitizenAdditionalChildInfoDto(),
        daycareAndSchoolInfo,
        new FamilyHistoryInfoDto(),
        new DevelopmentInfoDto(),
        new IllnessAndAccidentInfoDto(),
        new PromotionTherapyAndAidInfoDto(),
        new InterestsAndSportsInfoDto(),
        null);
  }
}
