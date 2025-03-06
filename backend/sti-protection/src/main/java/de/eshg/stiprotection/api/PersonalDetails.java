/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.base.GenderDto;
import de.eshg.lib.common.CountryCode;
import java.time.Year;

@ValidGermanyResidenceYear
public interface PersonalDetails {

  GenderDto gender();

  Year yearOfBirth();

  CountryCode countryOfBirth();

  Year inGermanySince();
}
