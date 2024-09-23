/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { optionsFromRecord } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { Stack } from "@mui/joy";
import { useState } from "react";

import { procedureStatusNames } from "@/lib/baseModule/api/procedures/enums";
import { useGetPendingFacilities } from "@/lib/businessModules/inspection/api/queries/facility";
import { useGetObjectTypes } from "@/lib/businessModules/inspection/api/queries/objectTypes";
import { PendingFacilitiesIncidentsSidebar } from "@/lib/businessModules/inspection/components/facility/pending/PendingFacilitiesIncidentsSidebar";
import {
  inspectionPendingFacilityKindNames,
  inspectionPhaseNames,
  inspectionTypeNames,
} from "@/lib/businessModules/inspection/shared/enums";
import { useIsOfflineFeatureEnabled } from "@/lib/businessModules/inspection/shared/offline/useIsOfflineFeatureEnabled";
import { PendingFacilitiesFilters } from "@/lib/businessModules/inspection/shared/types";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { SingleSelectFilter } from "@/lib/shared/components/tableFilters/SingleSelectFilter";
import { TextInputFilter } from "@/lib/shared/components/tableFilters/TextInputFilter";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

import {
  createPendingFacilitiesColumns,
  getPendingFacilityRowRoute,
} from "./columns";

type UserActivityState =
  | { type: "view-table" }
  | { type: "view-incidents"; inspectionId: string; facilityName: string };

const initialUserActivity: UserActivityState = { type: "view-table" };

export function PendingFacilitiesTable(
  props: Readonly<{ filter: PendingFacilitiesFilters }>,
) {
  const isOfflineEnabled = useIsOfflineFeatureEnabled();

  const { data: procedures, isFetching } = useGetPendingFacilities(
    props.filter,
  );
  const { data: objectTypes } = useGetObjectTypes();

  const tableControl = useTableControl({ serverSideSorting: true });
  const columns = createPendingFacilitiesColumns(
    isOfflineEnabled,
    handleViewIncidentsClick,
  );

  const [userActivity, setUserActivity] =
    useState<UserActivityState>(initialUserActivity);

  const objectTypeOptions = objectTypes.map((o) => ({
    label: o.name,
    value: o.id,
  }));

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
    <>
      <TablePage
        controls={
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <SingleSelectFilter
              searchParamName="kind"
              placeholder="Art"
              options={optionsFromRecord(inspectionPendingFacilityKindNames)}
              tableControl={tableControl}
            />
            <SingleSelectFilter
              searchParamName="objectTypeId"
              placeholder="Objekt-Typ"
              options={objectTypeOptions}
              tableControl={tableControl}
            />
            <TextInputFilter
              searchParamName="name"
              placeholder="Name"
              sx={{ flexGrow: 1 }}
              tableControl={tableControl}
            />
            <TextInputFilter
              searchParamName="postalCode"
              placeholder="PLZ"
              sx={{ maxWidth: "5rem" }}
              tableControl={tableControl}
            />
            <TextInputFilter
              searchParamName="city"
              placeholder="Stadt"
              sx={{ flexGrow: 1 }}
              tableControl={tableControl}
            />
            <TextInputFilter
              searchParamName="street"
              placeholder="Straße"
              sx={{ flexGrow: 1 }}
              tableControl={tableControl}
            />
            <SingleSelectFilter
              searchParamName="status"
              placeholder="Status"
              options={optionsFromRecord(procedureStatusNames)}
              tableControl={tableControl}
            />
            <SingleSelectFilter
              searchParamName="type"
              placeholder="Typ"
              options={optionsFromRecord(inspectionTypeNames)}
              tableControl={tableControl}
            />
            <SingleSelectFilter
              searchParamName="phase"
              placeholder="Phase"
              options={optionsFromRecord(inspectionPhaseNames)}
              tableControl={tableControl}
            />
          </Stack>
        }
      >
        <TableSheet
          loading={isFetching}
          footer={
            <Pagination
              totalCount={procedures.totalNumberOfElements}
              {...tableControl.paginationProps}
            />
          }
        >
          <DataTable
            data={procedures.elements}
            columns={columns}
            sorting={tableControl.tableSorting}
            rowNavRoute={getPendingFacilityRowRoute}
            focusColumnHeader={"Name"}
            striped
          />
        </TableSheet>
      </TablePage>
      {userActivity.type === "view-incidents" && (
        <PendingFacilitiesIncidentsSidebar
          open={true}
          onClose={handleSidebarClosed}
          inspectionId={userActivity.inspectionId}
          facilityName={userActivity.facilityName}
        />
      )}
    </>
  );
}
