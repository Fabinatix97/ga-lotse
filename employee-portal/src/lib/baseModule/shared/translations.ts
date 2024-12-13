/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiContactCategory } from "@eshg/employee-portal-api/base";

export const contactCategoryNames: Record<ApiContactCategory, string> = {
  [ApiContactCategory.Laboratory]: "Labor",
  [ApiContactCategory.School]: "Schule",
  [ApiContactCategory.Daycare]: "Kindertagesstätte",
  [ApiContactCategory.DoctorsOffice]: "Arztpraxis",
  [ApiContactCategory.HealthDepartment]: "Gesundheitsamt",
  [ApiContactCategory.Misc]: "Sonstiges",
};

export const contactCategoryNamesShort: Record<ApiContactCategory, string> = {
  ...contactCategoryNames,
  [ApiContactCategory.Daycare]: "Kita",
};
