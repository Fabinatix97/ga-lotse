/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { DynamicPageProps } from "@eshg/lib-portal";
import { ApiSchoolEntryFeature } from "@eshg/school-entry-api";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/schoolEntry/api/queries/featureTogglesApi";
import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";
import { SchoolInfoLetter } from "@/lib/businessModules/schoolEntry/features/procedures/reports/schoolInfoLetter/SchoolInfoLetter";

export default function SchoolInfoLetterPage(
  props: DynamicPageProps<SchoolEntryProcedureRouteParamsSchema>,
) {
  const { procedureId } = use(props.params);

  const isSchoolInfoLetterEnabled = useIsNewFeatureEnabled(
    ApiSchoolEntryFeature.EditableSchoolInfoLetter,
  );

  if (!isSchoolInfoLetterEnabled) {
    throw Error();
  }

  return <SchoolInfoLetter procedureId={procedureId} />;
}
