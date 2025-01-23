/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.data;

import de.eshg.lib.common.CountryCode;
import de.eshg.stiprotection.persistence.db.Gender;
import java.time.Year;

public record PersonData(
    Gender gender, Year yearOfBirth, CountryCode countryOfBirth, Year inGermanySince) {}
