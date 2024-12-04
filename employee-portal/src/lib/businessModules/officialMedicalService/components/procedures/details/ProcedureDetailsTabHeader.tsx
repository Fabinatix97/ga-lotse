/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@/lib/shared/components/tabNavigationToolbar/TabNavigationHeader";

export function ProcedureDetailsTabHeader() {
  return (
    <TabNavigationHeader titleAsH1>
      <TabNavigationHeaderTypography>
        Vorname Nachname
      </TabNavigationHeaderTypography>
      <TabNavigationHeaderTypography>Geb. ...</TabNavigationHeaderTypography>
    </TabNavigationHeader>
  );
}
