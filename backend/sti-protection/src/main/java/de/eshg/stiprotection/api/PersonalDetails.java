/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.base.GenderDto;
import de.eshg.lib.common.CountryCode;
import java.time.Year;

public interface PersonalDetails {

  GenderDto gender();

  Year yearOfBirth();

  Boolean hasSufficientGermanLanguageSkills();

  String otherKnownLanguages();

  default CountryCode countryOfBirth() {
    return null;
  }

  default Year inGermanySince() {
    return null;
  }

  String pronouns();
}
