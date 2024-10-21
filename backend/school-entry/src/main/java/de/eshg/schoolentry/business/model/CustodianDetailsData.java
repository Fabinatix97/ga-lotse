/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import de.eshg.lib.common.CountryCode;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CustodianDetailsData(
    long version,
    UUID fileStateId,
    Boolean fileStateOutdated,
    String title,
    SalutationDto salutation,
    GenderDto gender,
    String firstName,
    String lastName,
    LocalDate dateOfBirth,
    String nameAtBirth,
    String placeOfBirth,
    CountryCode countryOfBirth,
    List<String> emailAddresses,
    List<String> phoneNumbers,
    AddressDto contactAddress,
    AddressDto differentBillingAddress) {}
