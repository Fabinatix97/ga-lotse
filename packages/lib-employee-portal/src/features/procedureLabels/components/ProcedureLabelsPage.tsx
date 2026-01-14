/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { QueryKeyFactory } from "@eshg/lib-portal";

import { MainContentLayout } from "../../../components/layout/MainContentLayout";
import { StickyToolbarLayout } from "../../../components/layout/StickyToolbarLayout";
import { Toolbar } from "../../../components/toolbar/Toolbar";
import { useTableControl } from "../../table/hooks/useTableControl";
import { useGetProcedureLabelsQuery } from "../api/queries";
import { ProcedureLabelClient } from "../types/procedureLabelClient";

import { ProcedureLabelsTable } from "./ProcedureLabelsTable";

interface ProcedureLabelsPageProps {
  procedureLabelApi: ProcedureLabelClient;
  procedureLabelApiQueryKey: QueryKeyFactory;
  hasReadOnlyProcedureLabels?: boolean;
  canUserWrite: boolean;
}

export function ProcedureLabelsPage(props: ProcedureLabelsPageProps) {
  const tableControl = useTableControl();
  const getProcedureLabels = useSuspenseQuery(
    useGetProcedureLabelsQuery(
      props.procedureLabelApi,
      props.procedureLabelApiQueryKey,
      {
        pageNumber: tableControl.paginationProps.pageNumber,
        pageSize: tableControl.paginationProps.pageSize,
      },
    ),
  );

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Kennungen" />}>
      <MainContentLayout>
        <ProcedureLabelsTable
          procedureLabels={getProcedureLabels.data}
          tableControl={tableControl}
          loading={getProcedureLabels.isFetching}
          procedureLabelApi={props.procedureLabelApi}
          hasReadOnlyProcedureLabels={props.hasReadOnlyProcedureLabels ?? false}
          canUserWrite={props.canUserWrite}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
