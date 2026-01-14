/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiOpenDataFileType } from "@eshg/opendata-api";

export const fileTypeNames = {
  [ApiOpenDataFileType.Csv]: "CSV",
  [ApiOpenDataFileType.Pdf]: "PDF",
};
