/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiChildDetails } from "@eshg/employee-portal-api/dental";

import { Child, mapChild } from "./Child";
import { Examination, mapExamination } from "./Examination";

export interface ChildDetails extends Child {
  readonly examinations: Examination[];
}

export function mapChildDetails(response: ApiChildDetails): ChildDetails {
  return {
    ...mapChild(response),
    examinations: response.examinations.map(mapExamination),
  };
}
