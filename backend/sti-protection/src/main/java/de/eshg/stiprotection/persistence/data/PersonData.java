/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.data;

import de.eshg.stiprotection.persistence.db.Gender;
import java.time.Year;

public record PersonData(
    Gender gender,
    Year yearOfBirth,
    Boolean hasSufficientGermanLanguageSkills,
    String otherKnownLanguages,
    String pronouns) {}
