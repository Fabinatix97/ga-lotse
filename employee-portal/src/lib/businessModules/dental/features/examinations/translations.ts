/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiOralHygieneStatus } from "@eshg/dental-api";
import { ExaminationStatus } from "@eshg/dental/api/models/ExaminationStatus";

export const EXAMINATION_STATUS: Record<ExaminationStatus, string> = {
  OPEN: "offen",
  CLOSED: "abgeschlossen",
};

export const ORAL_HYGIENE_STATUS: Record<ApiOralHygieneStatus, string> = {
  [ApiOralHygieneStatus.Excellent]: "Sehr gut",
  [ApiOralHygieneStatus.Good]: "Gut",
  [ApiOralHygieneStatus.Poor]: "Schlecht",
};
