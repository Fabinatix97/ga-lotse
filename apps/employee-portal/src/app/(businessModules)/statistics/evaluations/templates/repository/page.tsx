/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { RepositoryEvaluationTemplatesOverview } from "@/lib/businessModules/statistics/components/evaluations/templates/RepositoryEvaluationTemplatesOverview";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/permissions/useStatisticsRoleChecks";

export default function RepositoryEvaluationTemplatesOverviewPage() {
  const { canWrite } = useStatisticsRoleChecks();
  if (!canWrite()) {
    throw Error();
  }
  return <RepositoryEvaluationTemplatesOverview />;
}
