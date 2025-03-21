/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  DataTable,
  TablePage,
  TableSheet,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { Typography } from "@mui/joy";
import { useState } from "react";

import { useGetPendingFacilities } from "@/lib/businessModules/inspection/api/queries/facility";
import { PendingFacilitiesIncidentsSidebar } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesIncidentsSidebar";

import {
  createPendingFacilitiesColumns,
  getPendingFacilityRowRoute,
} from "./columns";

type UserActivityState =
  | { type: "view-table" }
  | { type: "view-incidents"; inspectionId: string; facilityName: string };

const initialUserActivity: UserActivityState = { type: "view-table" };

export function PendingFacilitiesOfflineTable() {
  const { data: procedures, isFetching } = useGetPendingFacilities({});

  const tableControl = useTableControl({ serverSideSorting: false });
  const columns = createPendingFacilitiesColumns(
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
      <TableSheet loading={isFetching}>
        <DataTable
          data={procedures.elements}
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
