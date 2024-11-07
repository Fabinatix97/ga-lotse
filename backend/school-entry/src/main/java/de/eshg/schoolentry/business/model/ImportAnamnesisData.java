/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import java.time.LocalDate;

public record ImportAnamnesisData(
    int siblings,
    int nationalityChild,
    int nationalityFirstParent,
    int countryOfBirthFirstParent,
    int nationalitySecondParent,
    int countryOfBirthSecondParent,
    boolean hasMigrationBackground,
    int daycareValue,
    boolean preliminaryCourse,
    int birthWeight,
    boolean integrationPlace,
    boolean earlySupport,
    boolean ergoTherapy,
    boolean speechTherapy,
    boolean physioTherapy,
    boolean childLanguageScreening,
    Boolean u2,
    Boolean u3,
    Boolean u4,
    Boolean u5,
    Boolean u6,
    Boolean u7,
    Boolean u7a,
    Boolean u8,
    Boolean u9,
    LocalDate inGermanySince) {}
