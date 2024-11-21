/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInspPendingFacility } from "@eshg/employee-portal-api/inspection";
import { Typography } from "@mui/joy";
import { useEffect, useState } from "react";

import { getInspectionPendingFacilityFromOfflineInspections } from "@/lib/businessModules/inspection/api/queries/getInspectionPendingFacilityFromOfflineInspections";
import { PendingFacilitiesIncidentsSidebar } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesIncidentsSidebar";
import { useServiceWorker } from "@/lib/businessModules/inspection/shared/offline/ServiceWorkerProvider";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

import {
  createPendingFacilitiesColumns,
  getPendingFacilityRowRoute,
} from "./columns";

type UserActivityState =
  | { type: "view-table" }
  | { type: "view-incidents"; inspectionId: string; facilityName: string };

const initialUserActivity: UserActivityState = { type: "view-table" };

export function PendingFacilitiesOfflineTable() {
  const procedures = useInspectionPendingFacilityFromOfflineInspections();

  const tableControl = useTableControl({ serverSideSorting: false });
  const columns = createPendingFacilitiesColumns(
    false,
    handleViewIncidentsClick,
    () => undefined,
    () => undefined,
    false,
  );

  const [userActivity, setUserActivity] =
    useState<UserActivityState>(initialUserActivity);

  function handleSidebarClosed() {
    setUserActivity(initialUserActivity);
  }

  function handleViewIncidentsClick(
    inspectionId: string,
    facilityName: string,
  ) {
    setUserActivity({
      type: "view-incidents",
      inspectionId: inspectionId,
      facilityName: facilityName,
    });
  }

  return (
    <TablePage fullHeight>
      <TableSheet>
        <DataTable
          data={procedures}
          columns={columns}
          sorting={tableControl.tableSorting}
          noDataComponent={NoDataHint}
          rowNavigation={{
            route: getPendingFacilityRowRoute,
            focusColumnAccessorKey: "name",
          }}
          striped
        />
      </TableSheet>
      {userActivity.type === "view-incidents" && (
        <PendingFacilitiesIncidentsSidebar
          open={true}
          onClose={handleSidebarClosed}
          inspectionId={userActivity.inspectionId}
          facilityName={userActivity.facilityName}
        />
      )}
    </TablePage>
  );
}

function NoDataHint() {
  return (
    <>
      <Typography>Kein Begehung offline verfügbar</Typography>
      <Typography>
        Bitte aktivieren Sie die Offlinefähigkeit für Begehungsvorgänge die
        offline verfügbar sein sollen, wenn Sie online sind.
      </Typography>
    </>
  );
}

export function useInspectionPendingFacilityFromOfflineInspections() {
  const { sendMessageToServiceWorker } = useServiceWorker();

  const [facilities, setFacilities] = useState<ApiInspPendingFacility[]>([]);

  useEffect(() => {
    getInspectionPendingFacilityFromOfflineInspections(
      sendMessageToServiceWorker,
    ).then(
      (facilities) => setFacilities(facilities),
      (reason) => {
        throw reason;
      },
    );
  }, [sendMessageToServiceWorker]);

  return facilities;
}
