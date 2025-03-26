/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
