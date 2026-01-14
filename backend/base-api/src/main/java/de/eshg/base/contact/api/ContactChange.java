/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.api;

import de.eshg.base.history.HistoryChange;
import java.util.List;
import java.util.UUID;

public sealed interface ContactChange extends AbstractContactChange
    permits InstitutionContactChange, PersonContactChange {
  HistoryChange<UUID> mergedInto();

  HistoryChange<UUID> mergedFrom();

  HistoryChange<String> name();

  HistoryChange<List<String>> phoneNumbers();

  HistoryChange<List<String>> emailAddresses();
}
