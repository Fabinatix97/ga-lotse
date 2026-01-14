/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProgressEntryClass } from "@eshg/lib-procedures-api";

export const progressEntryClassTitles = {
  [ApiProgressEntryClass.ManualProgressEntry]: "Manueller-Verlaufseintrag",
  [ApiProgressEntryClass.SystemProgressEntry]: "System-Verlaufseintrag",
  [ApiProgressEntryClass.ProcessedInboxProgressEntry]:
    "Posteingangs-Verlaufseintrag",
} satisfies Record<ApiProgressEntryClass, string>;
