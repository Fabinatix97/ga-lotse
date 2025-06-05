/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiContactCategory, ApiContactSubCategory } from "@eshg/base-api";

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

export const CONTACT_SUB_CATEGORY_NAMES_SCHOOL: Record<
  ApiContactSubCategory,
  string
> = {
  [ApiContactSubCategory.Berufsschule]: "Berufsschule",
  [ApiContactSubCategory.Foerderschule]: "Förderschule",
  [ApiContactSubCategory.Grundschule]: "Grundschule",
  [ApiContactSubCategory.GrundHauptschule]: "Grund-Hauptschule",
  [ApiContactSubCategory.GrundHauptRealschule]: "Grund-Haupt-Realschule",
  [ApiContactSubCategory.Gymnasium]: "Gymnasium",
  [ApiContactSubCategory.Hauptschule]: "Hauptschule",
  [ApiContactSubCategory.HauptRealschule]: "Haupt-Realschule",
  [ApiContactSubCategory.IntegrierteGesamtschule]: "Integrierte Gesamtschule",
  [ApiContactSubCategory.KooperativeGesamtschule]: "Kooperative Gesamtschule",
  [ApiContactSubCategory.Realschule]: "Realschule",
};
