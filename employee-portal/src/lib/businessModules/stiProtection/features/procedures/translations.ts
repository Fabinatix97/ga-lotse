/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiWaitingStatus } from "@eshg/employee-portal-api/stiProtection";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

export const WAITING_STATUS_VALUES: EnumMap<ApiWaitingStatus> = {
  [ApiWaitingStatus.WaitingForConsultation]: "Wartet auf Beratung",
  [ApiWaitingStatus.WaitingForResultsReview]: "Wartet auf Ergebnisbesprechung",
  [ApiWaitingStatus.WaitingForTests]: "Wartet auf Tests",
  [ApiWaitingStatus.InConsultation]: "Im Gespräch",
  [ApiWaitingStatus.InTesting]: "Beim Testen",
  [ApiWaitingStatus.Cancelled]: "Abgesagt",
  [ApiWaitingStatus.Done]: "Fertig",
};

export const WAITING_STATUS_OPTIONS = buildEnumOptions(WAITING_STATUS_VALUES);
