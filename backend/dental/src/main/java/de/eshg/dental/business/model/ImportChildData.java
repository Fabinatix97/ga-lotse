/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.business.model;

import de.eshg.base.GenderDto;
import de.eshg.lib.xlsximport.model.AddressData;
import java.time.LocalDate;

public record ImportChildData(
    String lastName,
    String firstName,
    LocalDate dateOfBirth,
    GenderDto gender,
    String groupName,
    AddressData address) {}
