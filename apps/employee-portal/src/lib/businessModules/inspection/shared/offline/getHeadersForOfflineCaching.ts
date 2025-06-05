/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  PRE_CACHE_FOR_OFFLINE_MODE,
  X_ESHG_INSPECTION_ID,
} from "@/serviceWorker/common/common";

export function getHeadersForOfflineCaching(inspectionId?: string) {
  return {
    headers: {
      "Cache-Control": PRE_CACHE_FOR_OFFLINE_MODE,
      [X_ESHG_INSPECTION_ID]: inspectionId ?? "",
    },
  };
}
