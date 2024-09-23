/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import de.eshg.base.CountryCodeDto;
import de.eshg.base.history.HistoryChange;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record DomesticContactAddressChange(
    @NotNull @Valid HistoryChange<CountryCodeDto> country,
    @NotNull @Valid HistoryChange<String> city,
    @NotNull @Valid HistoryChange<String> postalCode,
    @NotNull @Valid HistoryChange<String> differentName,
    @NotNull @Valid HistoryChange<String> street,
    @NotNull @Valid HistoryChange<String> houseNumber,
    @NotNull @Valid HistoryChange<String> addressAddition)
    implements ContactAddressChange {

  public static final String SCHEMA_NAME = "DomesticContactAddressChange";
}
