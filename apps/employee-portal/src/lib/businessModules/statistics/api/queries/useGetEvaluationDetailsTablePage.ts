/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { isDeepEqual, isNullish } from "remeda";

import {
  ApiAttributeSelection,
  ApiSortDirection,
  GetEvaluationRequest,
} from "@eshg/statistics-api";

import {
  useEvaluationApi,
  useFilterTemplateApi,
} from "@/lib/businessModules/statistics/api/clients";
import { createQueryGetEvaluation } from "@/lib/businessModules/statistics/api/queries/useGetEvaluation";
import { createQueryGetFilterTemplates } from "@/lib/businessModules/statistics/api/queries/useGetFilterTemplates";

export function useGetEvaluationDetailsTablePage(
  evaluationRequest: GetEvaluationRequest,
  evaluationId: string,
) {
  const evaluationApi = useEvaluationApi();
  const filterTemplateApi = useFilterTemplateApi();

  const defaultSortAttributeRef = useRef<ApiAttributeSelection>(undefined);
  const defaultSortDirectionRef = useRef<ApiSortDirection>(undefined);

  const [{ data: evaluation }, { data: filterTemplates }] = useSuspenseQueries({
    queries: [
      createQueryGetEvaluation(evaluationApi, {
        ...evaluationRequest,
        apiGetEvaluationRequest: {
          ...evaluationRequest.apiGetEvaluationRequest,
          sortAttribute: !isDeepEqual(
            defaultSortAttributeRef.current,
            evaluationRequest.apiGetEvaluationRequest.sortAttribute,
          )
            ? evaluationRequest.apiGetEvaluationRequest.sortAttribute
            : undefined,
          sortDirection: !isDeepEqual(
            defaultSortDirectionRef.current,
            evaluationRequest.apiGetEvaluationRequest.sortDirection,
          )
            ? evaluationRequest.apiGetEvaluationRequest.sortDirection
            : undefined,
        },
      }),
      createQueryGetFilterTemplates(filterTemplateApi, evaluationId),
    ],
  });

  useEffect(() => {
    if (isNullish(defaultSortAttributeRef.current)) {
      defaultSortAttributeRef.current = evaluation.sortAttribute;
      defaultSortDirectionRef.current = evaluation.sortDirection;
    }
  }, [evaluation.sortAttribute, evaluation.sortDirection]);

  return {
    evaluation,
    filterTemplates,
  };
}
