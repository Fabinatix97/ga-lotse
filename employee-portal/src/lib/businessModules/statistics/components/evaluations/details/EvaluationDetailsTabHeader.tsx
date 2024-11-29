/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@/lib/shared/components/tabNavigationToolbar/TabNavigationHeader";

export interface EvaluationDetailsTabHeaderProps {
  evaluationName: string;
}

export function EvaluationDetailsTabHeader({
  evaluationName: evaluationName,
}: EvaluationDetailsTabHeaderProps) {
  return (
    <TabNavigationHeader titleAsH1>
      <TabNavigationHeaderTypography>
        {evaluationName}
      </TabNavigationHeaderTypography>
    </TabNavigationHeader>
  );
}
