/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createFieldNameMapper } from "@eshg/lib-portal";

import { SchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";

export const schoolInfoLetterForm = createFieldNameMapper<SchoolInfoLetter>();

export interface SchoolInfoLetterField {
  field: keyof SchoolInfoLetter;
  label: string;
  defaultValue: SchoolInfoLetter[keyof SchoolInfoLetter];
  subtitle?: string;
}
