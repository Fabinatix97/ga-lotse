/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useQuery } from "@tanstack/react-query";

import { ChildApi } from "@eshg/dental-api";

import { childApiQueryKey } from "../../../../config/apiQueryKeys";
import { useDentalApi } from "../../../../contexts/dental";
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

export function useValidateOpenChildrenExistInInstitution(
  institutionId: string,
  schoolYear: number,
) {
  const { childApi } = useDentalApi();

  return useQuery({
    queryKey: childApiQueryKey([
      "validateOpenChildrenExistInInstitution",
      institutionId,
      schoolYear,
    ]),
    queryFn: () =>
      childApi.validateOpenChildrenExistInInstitution(
        institutionId,
        schoolYear,
      ),
    enabled: institutionId !== "" && schoolYear !== 0,
  });
}
