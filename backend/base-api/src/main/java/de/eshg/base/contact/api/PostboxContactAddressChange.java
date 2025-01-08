/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import de.eshg.base.history.HistoryChange;
import de.eshg.lib.common.CountryCode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record PostboxContactAddressChange(
    @NotNull @Valid HistoryChange<CountryCode> country,
    @NotNull @Valid HistoryChange<String> city,
    @NotNull @Valid HistoryChange<String> postalCode,
    @NotNull @Valid HistoryChange<String> differentName,
    @NotNull @Valid HistoryChange<String> postbox)
    implements ContactAddressChange {

  public static final String SCHEMA_NAME = "PostboxContactAddressChange";
}
