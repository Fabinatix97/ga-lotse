/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChildApi } from "@eshg/dental-api";
import { queryOptions } from "@tanstack/react-query";

import { childApiQueryKey } from "@/config/apiQueryKeys";
import { mapChildDetails } from "@/features/children/api/models/ChildDetails";
import { mapChildExamination } from "@/features/children/api/models/ChildExamination";

export function getChildDetailsQuery(childApi: ChildApi, childId: string) {
  return queryOptions({
    queryKey: childApiQueryKey(["getChild", childId]),
    queryFn: () => childApi.getChild(childId),
    select: mapChildDetails,
  });
}

export function getExaminationQuery(childApi: ChildApi, examinationId: string) {
  return queryOptions({
    queryKey: childApiQueryKey(["getExamination", examinationId]),
    queryFn: () => childApi.getExamination(examinationId),
    select: mapChildExamination,
  });
}
