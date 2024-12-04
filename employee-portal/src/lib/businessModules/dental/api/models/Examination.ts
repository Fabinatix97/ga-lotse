/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiExamination } from "@eshg/employee-portal-api/dental";

export interface Examination {
  readonly dateAndTime: Date;
  readonly note?: string;
}

export function mapExamination(response: ApiExamination): Examination {
  return {
    dateAndTime: response.dateAndTime,
    note: response.note,
  };
}
