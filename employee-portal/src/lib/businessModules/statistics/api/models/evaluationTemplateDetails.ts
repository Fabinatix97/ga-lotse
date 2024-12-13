/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/base";

import { Analysis } from "@/lib/businessModules/statistics/api/models/analysis";

import { DataSourceSensitivity } from "./dataSourceSensitivity";

export interface EvaluationTemplateDetails {
  name: string;
  dataSourceName: string;
  dataSourceSensitivity?: DataSourceSensitivity;
  description?: string;
  createdAt: Date;
  user?: ApiUser;
  attributeLabels: string[];
  analyses: Analysis[];
  withoutAnonymizationAllowed: boolean;
}

export interface EvaluationTemplateDetailsFromRepository {
  name: string;
  description?: string;
  contact?: string;
  origin: string;
  createdAt: Date;
  dataSourceName: string;
  attributeLabels: string[];
  analyses: Analysis[];
}
