/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import de.eshg.base.history.HistoryChange;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record InstitutionContactChange(
    @NotNull @Valid HistoryChange<UUID> mergedInto,
    @NotNull @Valid HistoryChange<UUID> mergedFrom,
    @NotNull @Valid HistoryChange<String> name,
    @NotNull @Valid HistoryChange<InstitutionContactCategoryDto> category,
    @NotNull @Valid HistoryChange<List<String>> phoneNumbers,
    @NotNull @Valid HistoryChange<List<String>> emailAddresses)
    implements AbstractContactChange, ContactChange {
  public static final String SCHEMA_NAME = "InstitutionContactChange";
}
