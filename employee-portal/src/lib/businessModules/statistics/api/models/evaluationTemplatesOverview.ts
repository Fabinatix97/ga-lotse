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
  analysisCount: number;
  createdAt: Date;
  userId: string;
  businessModuleName: string;
}

export interface EvaluationTemplateWithUserInfo extends EvaluationTemplate {
  user: ApiUser | undefined;
}
