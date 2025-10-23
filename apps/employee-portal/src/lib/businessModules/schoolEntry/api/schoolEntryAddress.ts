/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiSchoolEntryDomesticAddress,
  ApiSchoolEntryPostboxAddress,
} from "@eshg/school-entry-api";

export type TaggedSchoolEntryDomesticAddress = {
  type: "SchoolEntryDomesticAddress";
} & ApiSchoolEntryDomesticAddress;
export type TaggedSchoolEntryPostboxAddress = {
  type: "SchoolEntryPostboxAddress";
} & ApiSchoolEntryPostboxAddress;

export type SchoolEntryAddress =
  | TaggedSchoolEntryDomesticAddress
  | TaggedSchoolEntryPostboxAddress;
