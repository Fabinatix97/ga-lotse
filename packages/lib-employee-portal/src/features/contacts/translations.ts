/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiContactCategory } from "@eshg/base-api";

export const CONTACT_CATEGORY_NAMES: Record<ApiContactCategory, string> = {
  [ApiContactCategory.Laboratory]: "Labor",
  [ApiContactCategory.School]: "Schule",
  [ApiContactCategory.Daycare]: "Kindertagesstätte",
  [ApiContactCategory.DoctorsOffice]: "Arztpraxis",
  [ApiContactCategory.HealthDepartment]: "Gesundheitsamt",
  [ApiContactCategory.Misc]: "Sonstiges",
};

export const CONTACT_CATEGORY_NAMES_SHORT: Record<ApiContactCategory, string> =
  {
    ...CONTACT_CATEGORY_NAMES,
    [ApiContactCategory.Daycare]: "Kita",
  };
