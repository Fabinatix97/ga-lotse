/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExaminationStatus } from "@eshg/dental/api/models/ExaminationStatus";

export const EXAMINATION_STATUS: Record<ExaminationStatus, string> = {
  OPEN: "offen",
  CLOSED: "abgeschlossen",
};
