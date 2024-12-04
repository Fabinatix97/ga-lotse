/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/base";

export interface EvaluationTemplateTableView {
  totalNumberOfElements: number;
  evaluationTemplates: EvaluationTemplateWithUserInfo[];
}

export interface EvaluationTemplate {
  id: string;
  name: string;
  createdAt: Date;
  dataSourceName: string;
}

export interface EvaluationTemplateWithUserInfo extends EvaluationTemplate {
  userId: string;
  analysisCount: number;
  user: ApiUser | undefined;
}

export interface EvaluationTemplateFromRepository extends EvaluationTemplate {
  origin: string;
  version: number;
}
