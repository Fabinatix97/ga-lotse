/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/base";

import { DataSourceSensitivity } from "./dataSourceSensitivity";

export interface EvaluationTemplateTableView {
  totalNumberOfElements: number;
  evaluationTemplates: EvaluationTemplateWithUserInfo[];
}

export interface EvaluationTemplate {
  id: string;
  name: string;
  createdAt: Date;
  dataSourceName: string;
  dataSourceSensitivity?: DataSourceSensitivity;
}

export interface EvaluationTemplateWithUserInfo extends EvaluationTemplate {
  userId: string;
  analysisCount: number;
  user: ApiUser | undefined;
  userMayCreateEvaluation: boolean;
}

export interface EvaluationTemplateFromRepository extends EvaluationTemplate {
  origin: string;
  version: number;
}
