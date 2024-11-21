/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/base";

import { Analysis } from "@/lib/businessModules/statistics/api/models/analysis";

export interface EvaluationTemplateDetails {
  name: string;
  dataSourceName: string;
  description?: string;
  createdAt: Date;
  user?: ApiUser;
  attributeLabels: string[];
  analyses: Analysis[];
  withoutAnonymizationAllowed: boolean;
}
