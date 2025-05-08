/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { routes } from "../../../config/routes";
import { getSchoolsForTransitionQuery } from "../api/queries/schoolYearTransition";

import { SchoolYearTransitionBasePage } from "./SchoolYearTransitionBasePage";

export function SchoolYearTransitionSchoolPage() {
  return (
    <SchoolYearTransitionBasePage
      titleSuffix="Schulen"
      tableHeader="Schule"
      countHeader="Bearbeitete Gruppen"
      queryOptions={getSchoolsForTransitionQuery}
      route={routes.children.schoolYearTransition.groups}
    />
  );
}
