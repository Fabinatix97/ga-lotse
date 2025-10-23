/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api.anamnesis;

import de.eshg.schoolentry.api.*;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "Anamnesis")
public record AnamnesisDto(
    @NotNull
        @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        long version,
    @Schema(
            description =
                "Boolean that indicates, if the child participated in the KiSS language screening.")
        Boolean childLanguageScreening,
    @Schema(
            description =
                "Boolean that indicates, if the KiSS language screening documents are allowed to be viewed during the examination.")
        Boolean languageScreeningConsent,
    @Schema(
            description =
                "Boolean that indicates, if the child participated in a preliminary course.")
        Boolean preliminaryCourse,
    @NotNull @Valid CheckUpsDto checkUps,
    @NotNull @Valid PromotionBeforeSchoolEntryDto promotionBeforeSchoolEntry,
    @NotNull @Valid MigrationBackgroundDto migrationBackground,
    @NotNull @Valid AdditionalChildInfoDto additionalChildInfo,
    @NotNull @Valid DaycareAndSchoolInfoDto daycareAndSchoolInfo,
    @NotNull @Valid FamilyHistoryInfoDto familyHistoryInfo,
    @NotNull @Valid DevelopmentInfoDto developmentInfo,
    @NotNull @Valid IllnessAndAccidentInfoDto illnessAndAccidentInfo,
    @NotNull @Valid PromotionTherapyAndAidInfoDto promotionTherapyAndAidInfo,
    @NotNull @Valid InterestsAndSportsInfoDto interestsAndSportsInfo,
    Boolean personalConspicuities,
    String note) {}
