/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { ApiBusinessModule } from "@eshg/base-api";

import { useStatisticsProcedureReferenceApi } from "@/lib/shared/api/clients";
import { getProcedureIdsQuery } from "@/lib/shared/api/queries/statisticsProcedureReference";

export function useGetProcedureIds({
  businessModule,
  procedureReferenceIds,
}: {
  businessModule: ApiBusinessModule;
  procedureReferenceIds: string[];
}) {
  const statisticsProcedureReferenceApi =
    useStatisticsProcedureReferenceApi(businessModule);

  const query = useQuery({
    ...getProcedureIdsQuery({
      statisticsProcedureReferenceApi,
      businessModule,
      request: {
        procedureReferences: procedureReferenceIds,
      },
    }),
    select: ({ referenceToId }) => {
      return {
        resolveProcedureId: (procedureReferenceId: string | undefined) =>
          isDefined(procedureReferenceId)
            ? referenceToId[procedureReferenceId]
            : undefined,
      };
    },
    enabled: procedureReferenceIds.length > 0,
    throwOnError: false,
  });

  return query.data;
}
