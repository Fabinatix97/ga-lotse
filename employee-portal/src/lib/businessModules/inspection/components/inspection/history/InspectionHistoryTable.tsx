/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInspPendingFacility } from "@eshg/employee-portal-api/inspection";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { useGetFacilityHistory } from "@/lib/businessModules/inspection/api/queries/facility";
import { useGetInspection } from "@/lib/businessModules/inspection/api/queries/inspection";
import { useIsOfflineFeatureEnabled } from "@/lib/businessModules/inspection/shared/offline/useIsOfflineFeatureEnabled";
import { PendingFacilitiesFilters } from "@/lib/businessModules/inspection/shared/types";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";
import { precachedInspectionIds } from "@/serviceWorker/common/precachedInspectionIds";

import {
  createInspectionHistoryColumns,
  getPendingFacilityRowRoute,
} from "./columns";

export function InspectionHistoryTable(
  props: Readonly<{
    filter: PendingFacilitiesFilters;
    inspectionId: string;
  }>,
) {
  const isOfflineEnabled = useIsOfflineFeatureEnabled();
  const isOffline = useIsOffline();
  const { data: inspection } = useGetInspection(props.inspectionId);

  const { data: procedures, isFetching } = useGetFacilityHistory(
    inspection.externalId,
    inspection.facility.id,
  );

  const tableControl = useTableControl({
    initialSorting: {
      id: "executedFrom",
      desc: true,
    },
  });
  const columns = createInspectionHistoryColumns(
    props.inspectionId,
    isOfflineEnabled && !isOffline,
  );

  const router = useRouter();

  function handleClick(row: Row<ApiInspPendingFacility>) {
    if (!isOfflineEnabled || !isOffline) {
      router.push(getPendingFacilityRowRoute(row));
    }

    void precachedInspectionIds.get(row.original.inspection!.id).then((s) => {
      if (s === "success") {
        router.push(getPendingFacilityRowRoute(row));
      }
    });
  }

  return (
    <TablePage fullHeight>
      <TableSheet loading={isFetching}>
        <DataTable
          data={procedures.elements}
          columns={columns}
          sorting={tableControl.tableSorting}
          striped
          rowNavigation={{
            onClick: (row) => () => handleClick(row),
            focusColumnAccessorKey: "name",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}
