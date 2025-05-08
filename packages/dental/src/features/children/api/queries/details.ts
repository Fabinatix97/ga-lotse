/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { ChildApi } from "@eshg/dental-api";

import { childApiQueryKey } from "../../../../config/apiQueryKeys";
import { mapChildDetails } from "../models/ChildDetails";
import { mapChildExamination } from "../models/ChildExamination";

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
