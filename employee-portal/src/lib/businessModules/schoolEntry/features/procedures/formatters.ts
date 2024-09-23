/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Nullable } from "@eshg/lib-portal/types/utility";
import { isNullish } from "remeda";

export function formatSchoolYear(schoolYear: Nullable<number>): string {
  if (isNullish(schoolYear)) {
    return "";
  }

  const nextYear = schoolYear + 1;
  return `${yearShort(schoolYear)}/${yearShort(nextYear)}`;
}

function yearShort(year: number) {
  return year.toString().slice(-2);
}
