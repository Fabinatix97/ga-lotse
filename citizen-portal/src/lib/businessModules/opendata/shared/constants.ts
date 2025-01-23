/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiOpenDataFileType } from "@eshg/citizen-portal-api/openData";

export const fileTypeNames = {
  [ApiOpenDataFileType.Csv]: "CSV",
  [ApiOpenDataFileType.Pdf]: "PDF",
};
