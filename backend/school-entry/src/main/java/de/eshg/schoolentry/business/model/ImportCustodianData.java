/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.business.model;

import de.eshg.base.GenderDto;
import de.eshg.base.SalutationDto;
import de.eshg.lib.xlsximport.model.AddressData;
import java.time.LocalDate;

public record ImportCustodianData(
    String firstName,
    String lastName,
    AddressData address,
    LocalDate dateOfBirth,
    String title,
    SalutationDto salutation,
    GenderDto gender) {}
