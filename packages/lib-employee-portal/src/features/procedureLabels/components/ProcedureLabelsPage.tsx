/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";

import { MainContentLayout } from "@/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { useGetProcedureLabels } from "@/features/procedureLabels/api/queries";
import { ProcedureLabelClient } from "@/features/procedureLabels/types/procedureLabelClient";

import { ProcedureLabelsTable } from "./ProcedureLabelsTable";

interface ProcedureLabelsPageProps {
  procedureLabelApi: ProcedureLabelClient;
  procedureLabelApiQueryKey: QueryKeyFactory;
}

export function ProcedureLabelsPage(props: ProcedureLabelsPageProps) {
  const getProcedureLabels = useGetProcedureLabels(
    props.procedureLabelApi,
    props.procedureLabelApiQueryKey,
  );

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Kennungen" />}>
      <MainContentLayout fullViewportHeight>
        <ProcedureLabelsTable
          procedureLabels={getProcedureLabels.data}
          loading={getProcedureLabels.isFetching}
          procedureLabelApi={props.procedureLabelApi}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
