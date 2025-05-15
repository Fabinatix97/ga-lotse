/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiArchivingRelevance } from "@eshg/base-api";

export const ARCHIVING_RELEVANCE_NAMES = {
  [ApiArchivingRelevance.Default]: "Standard",
  [ApiArchivingRelevance.Irrelevant]: "Löschen",
  [ApiArchivingRelevance.Relevant]: "Archivieren",
} satisfies Record<ApiArchivingRelevance, string>;
