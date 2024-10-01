/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { formatDurationRounded } from "@/lib/shared/helpers/dateTime";

export function formatOptionalDuration(value: string | undefined) {
  return isDefined(value) ? formatDurationRounded(value) : "-";
}
