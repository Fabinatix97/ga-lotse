/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createCountFormatter } from "@eshg/lib-employee-portal";

export const formatImportedCount = createCountFormatter("Vorgang", "Vorgänge");

export const formatIncidentCount = createCountFormatter(
  "Vorkommnis",
  "Vorkommnisse",
);

export const formatPossibleDuplicates = createCountFormatter(
  "potentielles Duplikat",
  "potentielle Duplikate",
);
