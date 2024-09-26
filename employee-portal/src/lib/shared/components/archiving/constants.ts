/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiArchivingRelevance } from "@eshg/employee-portal-api/base";

export const archivingRelevanceNames = {
  [ApiArchivingRelevance.Default]: "Standard",
  [ApiArchivingRelevance.Irrelevant]: "Löschen",
  [ApiArchivingRelevance.Relevant]: "Archivieren",
} satisfies Record<ApiArchivingRelevance, string>;
