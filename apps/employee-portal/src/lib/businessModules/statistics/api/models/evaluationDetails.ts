/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Analysis } from "@/lib/businessModules/statistics/api/models/analysis";

export interface EvaluationDetails {
  dataSourceName: string;
  attributeLabels: string[];
  analyses: Analysis[];
}
