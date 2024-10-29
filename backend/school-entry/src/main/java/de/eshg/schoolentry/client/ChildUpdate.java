/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.client;

import de.eshg.lib.common.CountryCode;
import de.eshg.schoolentry.domain.model.SchoolEntryProcedure;

public record ChildUpdate(
    SchoolEntryProcedure procedure,
    String placeOfBirth,
    CountryCode countryOfBirth,
    String phoneNumber) {}
