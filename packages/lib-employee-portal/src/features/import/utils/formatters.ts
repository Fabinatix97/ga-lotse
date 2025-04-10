/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { createCountFormatter } from "@/utils/formatters";

export const formatDuplicatedRecordCount = createCountFormatter(
  "doppelter Datensatz",
  "doppelte Datensätze",
);

export const formatFaultyRecordCount = createCountFormatter(
  "fehlerhafter Datensatz",
  "fehlerhafte Datensätze",
);

export const formatTotalRecordCount = createCountFormatter(
  "Datensatz",
  "Datensätze",
);
