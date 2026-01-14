/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.base.address.AddressDto;
import java.util.List;

public record PersonDetailsWithoutDateOfBirthData(
    String title,
    SalutationDto salutation,
    GenderDto gender,
    String firstName,
    String lastName,
    List<String> emailAddresses,
    List<String> phoneNumbers,
    AddressDto contactAddress) {}
