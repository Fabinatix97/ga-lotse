/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { routes } from "../../../config/routes";
import { getDaycaresForTransitionQuery } from "../api/queries/schoolYearTransition";

import { SchoolYearTransitionBasePage } from "./SchoolYearTransitionBasePage";

export function SchoolYearTransitionDaycarePage() {
  return (
    <SchoolYearTransitionBasePage
      titleSuffix="Kitas"
      tableHeader="Kita"
      countHeader="Bearbeitete Kinder"
      queryOptions={getDaycaresForTransitionQuery}
      route={routes.children.schoolYearTransition.children}
    />
  );
}
